/**
 * index
 * Project: vu-course-planner
 * Author: jovialis (Dylan Hanson)
 * Date: 9/13/23
 */
import { getAllSections, getSectionDetails, getSubjects, getTerms } from "@vanderbilt/yes-api";
import { getFirestore } from "firebase-admin/firestore";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { initApp } from "./utils/initApp.js";
initApp();
/**
 * Scrape all existing Terms, scheduled once per week
 */
export const scrapeTerms = onSchedule({
    schedule: "* * * * 0",
    timeoutSeconds: 60 * 5 // 5 minutes
}, async () => {
    const firestore = getFirestore();
    let batch = firestore.batch();
    let i = 0;
    // Iterate through fetched terms and store their info in Firebase
    await getTerms(async (term, timestamp) => {
        const termRef = firestore
            .collection("yes_terms")
            .doc(term.id.toLowerCase());
        if ((await termRef.get()).exists) {
            return;
        }
        batch.set(termRef, {
            id: term.id,
            name: term.title,
            last_scraped: null,
        });
        i += 1;
        // Store all of the sub-sessions in the Term in their own collection
        for (const session of (term.sessions || [])) {
            const sessionRef = termRef
                .collection("sessions")
                .doc(session.id.toLowerCase());
            batch.set(sessionRef, {
                id: session.id,
                nameShort: session.titleShort,
                nameLong: session.titleLong
            });
            i += 1;
        }
        // Commit after 400 writes as Firestore batches can only take 500 queries at max
        if (i > 400) {
            await batch.commit();
            batch = firestore.batch();
            i = 0;
        }
    });
    await batch.commit();
});
/**
 * Scrape subjects function, scheduled to run once per week
 */
export const scrapeSubjects = onSchedule({
    schedule: "* * * * 0",
    timeoutSeconds: 60 * 5 // 5 min
}, async () => {
    const firestore = getFirestore();
    let batch = firestore.batch();
    let i = 0;
    // Iterate through fetched subjects and update their Firestore info
    await getSubjects(async (value) => {
        // Grab a reference to the document
        const ref = firestore
            .collection("yes_subjects")
            .doc(value.id.toLowerCase());
        batch.set(ref, {
            id: value.id.toLowerCase(),
            name: value.name
        });
        i += 1;
        // Commit after 450 writes as Firestore batches can only take 500 queries at max
        if (i > 450) {
            await batch.commit();
            batch = firestore.batch();
            i = 0;
        }
    });
    // Commit any leftover subjects
    await batch.commit();
});
/**
 * Goes through all Terms and scrapes Sections for those that haven't been scraped yet
 */
export const backscrapeSectionsForTerms = onSchedule({
    schedule: "*/30 * * * *",
    timeoutSeconds: 60 * 60 // 1 hour
}, async (event) => {
    const firestore = getFirestore();
    const nextTermToScrape = await firestore
        .collection("yes_terms")
        .where("last_scraped", "==", null)
        .orderBy("last_scraped", "desc")
        .limit(1)
        .get();
    if (nextTermToScrape.empty) {
        return;
    }
    const termRef = firestore
        .collection("yes_terms")
        .doc(nextTermToScrape.docs[0].id);
    const term = nextTermToScrape.docs[0].data();
    let batch = firestore.batch();
    let i = 0;
    await getAllSections(term, false, async (section, timestamp) => {
        const sectionRef = termRef
            .collection("sections")
            .doc(section.id);
        batch.set(sectionRef, {
            ...section,
            id: section.id.toLowerCase(),
            course: {
                ...section.course,
                number: Number.parseInt((section.course.abbreviation.match(/\d{4}/) || [])[0]) || null
            },
            details: null,
            details_last_scraped: null
        });
        i += 1;
        // Commit after 200 writes as Firestore batches can only take 500 queries at max, and this can time out
        if (i > 200) {
            await batch.commit();
            batch = firestore.batch();
            i = 0;
        }
    });
    // Commit any leftover subjects
    await batch.commit();
    // Mark the term as scraped
    await termRef.update({
        last_scraped: new Date()
    });
});
/**
 * Fetches Details for a newly-created Section document, allowing them to be fetched more/less in parallel
 */
export const scrapeSectionDetailsOnCreate = onDocumentCreated("yes_terms/{termId}/sections/{sectionId}", async (event) => {
    const { termId, sectionId } = event.params;
    // Has details content? Skip
    if (event.data?.get("details")) {
        return;
    }
    const firestore = getFirestore();
    const section = event.data.data();
    // Fetch the details
    const details = await getSectionDetails(section);
    if (details) {
        await firestore
            .collection("yes_terms")
            .doc(termId)
            .collection("sections")
            .doc(sectionId)
            .update({
            details: details,
            details_last_scraped: new Date()
        });
        console.log('Fetched details for ', event.params);
    }
    else {
        console.log('Unable to get details for ', event.params);
    }
});
/**
 * Every 5 minutes, searches for <= 200 sections without "Details" added and scrapes their details
 */
export const scrapeMissingSectionDetails = onSchedule({
    schedule: "*/5 * * * *",
    timeoutSeconds: 60 * 20 // 20 minutes
}, async (event) => {
    const firestore = getFirestore();
    const multi = await firestore
        .collectionGroup("sections")
        .where("details", "==", null)
        .limit(1000)
        .get();
    const batch = firestore.batch();
    for (const doc of multi.docs) {
        const section = doc.data();
        const details = await getSectionDetails(section);
        batch.update(doc.ref, {
            details: details,
            details_last_scraped: new Date()
        });
    }
    await batch.commit();
    console.log('Scraped details for', multi.size, 'sections.');
});
// /**
//  * Adds a "number" field to every Section that doesn't yet have one.
//  */
// export const writeSectionNumbers = onRequest({
// 	timeoutSeconds: 60 * 60 // 1 hour
// }, async (request, response) => {
// 	const firestore = getFirestore();
//
// 	const allSections = await firestore
// 		.collectionGroup("sections")
// 		// .limit(1000)
// 		.get()
//
// 	const unnumbered = allSections.docs.filter(doc => !doc.get("course.number"));
// 	let i = 0;
//
// 	while (i < unnumbered.length) {
// 		await firestore.runTransaction(async transaction => {
//
// 			let modCount = 0;
// 			while (modCount < 10000 && i < unnumbered.length) {
// 				const doc = unnumbered[i];
// 				if (!doc)
// 					break; // Failsafe
//
// 				const section = doc.data() as Section;
// 				const courseNum = Number.parseInt((section.course.abbreviation.match(/\d{4}/) || [])[0]) || null;
//
// 				// Skip this one if we couldn't pull a course num from it
// 				if (!courseNum) {
// 					transaction.update(doc.ref, {
// 						"course.number": null
// 					})
// 				} else {
// 					transaction.update(doc.ref, {
// 						"course.number": courseNum
// 					})
// 				}
//
//
// 				i++;
// 				modCount++;
// 			}
// 		}, {
//
// 		})
// 	}
//
// 	response.json({
// 		success: true
// 	})
// })
