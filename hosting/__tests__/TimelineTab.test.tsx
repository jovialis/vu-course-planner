import {TimelineTab} from "../components/TimelineTab";
import {render} from "@testing-library/react";
import {Tabs} from "@chakra-ui/react";

describe('TimelineTab', () => {
    it('render Timeline Tab', () => {
        render(<Tabs>
            <TimelineTab
                timeline_id={'spring2024'}
                timeline_name={'Spring2024'}
                refetchTimeline={() => {}}/>
        </Tabs>)
    });
})