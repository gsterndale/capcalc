import React, { useState } from "react";
import parseInput from "../common/parseInput";
import {
  Button,
  Tabs,
  type TabsRef,
  TextInput,
  Label,
  Checkbox,
  Table,
  Select,
  Card,
  Sidebar,
  Accordion,
} from "flowbite-react";
import {
  TbArrowRight,
  TbSquareRoundedArrowRight,
  TbSquareRoundedArrowLeft,
  TbCheck,
  TbPencil,
  TbTable,
  TbSquareRoundedPlus,
  TbTrash,
  TbRowInsertBottom,
  TbColumns3,
  TbColumnInsertRight,
  TbCurrencyDollar,
  TbPercentage,
  TbSquareRoundedLetterA,
  TbSquareRoundedLetterB,
  TbSquareRoundedLetterC,
  TbSquareRoundedLetterD,
  TbCoin,
  TbFileDollar,
  TbArrowFork,
  TbGitFork,
  TbBusinessplan,
  TbLayoutRows,
  TbStack3,
} from "react-icons/tb";
import { NoteFields } from "@capcalc/calc";
import { prettyPercent, prettyUSD } from "@capcalc/utils";

type AppProps = {
  handler: Function;
};
const initialNotesFieldsState: NoteFields[] = [
  {
    principalInvested: 1200000,
    conversionDiscount: 0.2,
    name: "Broad St Angels",
  },
  {
    principalInvested: 1000000,
    conversionDiscount: 0.2,
    conversionCap: 5000000,
    interestRate: 0.2,
    conversionDate: new Date(),
    name: "BFTP",
  },
];

const ConvertibleNotesList: React.FC<AppProps> = (props: AppProps) => {
  const [notesFields, setNotesFields] = useState<Array<NoteFields>>(
    initialNotesFieldsState
  );

  const handleConvertibleNoteInputChange = (
    //React.FormEventHandler<HTMLFieldSetElement>
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseInput(value, type, checked);

    // TODO update notesFields element with inputValue
    setNotesFields((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));

    props.handler("notesFields", notesFields);
  };

  const removeNoteField = (index: number) => {
    notesFields.splice(index, 1);
    props.handler("notesFields", notesFields);
  };

  const summarizeNote = (note: NoteFields) => {
    let summary = [
      prettyUSD(note.principalInvested),
      prettyPercent(note.conversionDiscount),
    ];
    if (note.conversionCap !== undefined)
      summary.push(` ${prettyUSD(note.conversionCap)} Cap`);
    return summary.join(" ");
  };

  const detailNote = (note: NoteFields) => {
    let detail: string[] = [];
    if (note.conversionDate !== undefined)
      detail.push(note.conversionDate.toLocaleDateString());
    if (note.interestRate !== undefined)
      detail.push(`${prettyPercent(note.interestRate)} APR`);
    return detail.join(" ");
  };

  return (
    <div>
      <fieldset>
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notesFields.map((note, index) => (
              <li key={index} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1 items-center text-base font-semibold text-gray-900 dark:text-white">
                    {note.name}
                  </div>
                  <div className="">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {summarizeNote(note)}
                    </p>
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      {detailNote(note)}
                    </p>
                  </div>
                  <div className="">
                    <Button
                      size="xs"
                      color="gray"
                      onClick={() => removeNoteField(index)}
                    >
                      <TbTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}

            <li className="pb-0 pt-3 sm:pt-4 text-right">
              <Button size="xs" color="gray">
                <TbRowInsertBottom className="mr-2 h-5 w-5" />
                <p>Add Convertible Note</p>
              </Button>
            </li>
          </ul>
        </div>
      </fieldset>

      <fieldset>
        <legend>New Convertible Note</legend>
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <div>
              <Label value="Name" />
              <TextInput
                sizing="sm"
                name="name"
                onChange={handleConvertibleNoteInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <Label value="Principal Invested" />
              <TextInput
                type="number"
                sizing="sm"
                name="principalInvested"
                icon={TbCurrencyDollar}
              />
            </div>
            <div>
              <Label value="Conversion Discount" />
              <TextInput
                type="number"
                sizing="sm"
                name="conversionDiscount"
                rightIcon={TbPercentage}
              />
            </div>
            <div>
              <Label value="Conversion Cap" />
              <TextInput
                type="number"
                sizing="sm"
                name="conversionCap"
                icon={TbCurrencyDollar}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <Label value="Interest Rate" />
              <TextInput
                type="number"
                sizing="sm"
                name="interestRate"
                rightIcon={TbPercentage}
              />
            </div>
            <div>
              <Label value="Interest Start Date" />
              <TextInput type="date" sizing="sm" name="interestStartDate" />
            </div>
            <div>
              <Label value="Conversion Date" />
              <TextInput type="date" sizing="sm" name="conversionDate" />
            </div>
            <div className="">
              <Button size="xs" color="gray">
                <TbRowInsertBottom className="mr-2 h-5 w-5" />
                <p>Save</p>
              </Button>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default ConvertibleNotesList;
