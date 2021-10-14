import { Random as r } from 'mockjs';
const testResultsOptions = [
  { label: '通过', value: '1c5074fe9-875ebccd9203' },
  { label: '不通过', value: '22bdd53b-f36ab3241' },
  { label: '阻塞', value: '6e4993dad233ed2b' },
  { label: '不涉及', value: '23038e1fa5' },
];
const priorityOptions = [
  { label: 'P1', value: '0ed09e77a3' },
  { label: 'P2', value: 'ac973902f2b10d0' },
  { label: 'P3', value: '5d87ac-621-9dc808f' },
  { label: 'P4', value: 'ddd1-49a1-b-4300d7' },
];
const caseMock: { [key: string]: any }[] = [];
const num = 100;
for (let i = 0; i < num; ++i) {
  const t = {
    createdBugCount: r.natural(1, 10),
    testResults: testResultsOptions.map((t) => t.value)[r.natural(0, 3)],
    modifyId: r.string('lower', 36),
    isValid: r.boolean(),
    creatorId: r.string('lower', 36),
    packageId: r.string('lower', 36),
    precondition: r.cparagraph(),
    priority: priorityOptions.map((t) => t.value)[r.natural(0, 3)],
    steps: r.cparagraph(2),
    modifyTime: r.date('T'),
    function: r.cparagraph(1),
    createdTime: r.date(),
    id: r.string('upper', 36),
    sn: r.natural(1, 100),
    expectedResults: r.cparagraph(2),
    tranformSteps: r.cparagraph(),
    testCaseId: r.string('lower', 36),
  };
  caseMock.push(t);
}

export { caseMock, testResultsOptions, priorityOptions };
