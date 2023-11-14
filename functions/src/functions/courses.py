import json, re
from collections import deque

def search(id):
    from src.utils.init_firestore import init_firestore
    db = init_firestore()

    major, num = id.split(' ')
    courses = set()

    q = deque([id])
    def search(class_id):
        doc_ref = db.collection('courses').where('id', '==', id).stream()
        for dr in doc_ref:
            d = dr.to_dict()
            if 'prerequisites_raw' in d:
                pres = re.findall("[0-9]{4}", d['prerequisites_raw'])
                for pre in pres:
                    q.appendleft(major + ' ' + pre)
    while q:
        cur = q.popleft()
        if cur not in courses:
            courses.add(cur)
            search(cur)
    return courses

def fetch_cond_courses(subj, cond):
    from src.utils.init_firestore import init_firestore
    db = init_firestore()

    valid_conds = {'==', '>', '<', '>=', '<='}
    ne = set()
    res = set()
    query = db.collection('courses').where('subject', '==', subj)
    for c in cond:
        if ' ' in c:
            eq, val = c.split(' ')
            if eq in valid_conds:
                query = query.where('id', eq, val)
            elif eq == '!=':
                ne.add(val)
    doc_ref = query.stream()
    for dr in doc_ref:
        d = dr.to_dict()
        major, num = d['id'].split(' ')
        if num not in ne:
            res.update(search(d['id']))
    return res
