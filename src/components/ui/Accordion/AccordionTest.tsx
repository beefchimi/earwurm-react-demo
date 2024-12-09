import {Accordion} from './Accordion.tsx';
import {AccordionList} from './AccordionList.tsx';
import {MOCK_ACCORDION} from './AccordionTest.data.ts';

export function AccordionTest() {
  return (
    <AccordionList>
      {MOCK_ACCORDION.map(({title, text}, index) => (
        <AccordionList.Item key={title}>
          <Accordion id={`Accordion-${index}`} title={title}>
            <Accordion.Content>
              {text.map((line) => (
                <Accordion.Text key={line}>{line}</Accordion.Text>
              ))}
            </Accordion.Content>
          </Accordion>
        </AccordionList.Item>
      ))}
    </AccordionList>
  );
}
