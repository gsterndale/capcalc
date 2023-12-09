import React, { useState } from "react";
import parseInput from "../common/parseInput";
import parseFloatInLocale from "../common/parseFloatInLocale";
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
  Tooltip,
} from "flowbite-react";
import {
  TbInfoCircle,
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
  handleAddNoteFields: Function;
  handleRemoveNoteFields: Function;
  notesFields: NoteFields[];
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

const pick = <T extends {}, K extends keyof T>(obj: T, ...keys: K[]) =>
  Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  ) as Pick<T, K>;

const ConvertibleNotesList: React.FC<AppProps> = (props: AppProps) => {
  const [notesFields, setNotesFields] = useState<Array<NoteFields>>(
    props.notesFields
  );

  type InputValue = string | number | Date | boolean;
  type FormEntry = [string, InputValue];
  type HTMLFormControl =
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement;

  const handleAddNoteSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const entries: FormEntry[] = Array.from(form.elements).reduce(
      (memo, element) => {
        const { name, value, type } = element as HTMLFormControl;
        let inputValue = parseInput(value, type, undefined);
        if (inputValue !== undefined && inputValue !== "") {
          if (
            ["conversionDiscount", "interestRate"].includes(name) &&
            typeof inputValue == "number"
          )
            inputValue = inputValue / 100.0;
          if (["principalInvested", "conversionCap"].includes(name)) {
            const parsedInLocale = parseFloatInLocale(value);
            if (typeof parsedInLocale == "number") inputValue = parsedInLocale;
          }
          memo.push([name, inputValue]);
        }
        return memo;
      },
      [] as FormEntry[]
    );
    const noteFields = Object.fromEntries(entries) as NoteFields;
    setNotesFields((prevState) => {
      return prevState.concat(noteFields);
    });
    props.handleAddNoteFields(noteFields);
    form.reset();
  };

  function handleRemoveNote(index: number): void {
    setNotesFields((prevNotesFields) => {
      return prevNotesFields.filter((_, i) => i !== index);
    });
    props.handleRemoveNoteFields(index);
  }

  const summarizeNote = (note: NoteFields) => {
    let summary = [prettyUSD(note.principalInvested)];
    if (note.conversionCap !== undefined)
      summary.push(`with ${prettyUSD(note.conversionCap)} cap,`);
    summary.push(prettyPercent(note.conversionDiscount), "disc");
    return summary.join(" ");
  };

  const detailNote = (note: NoteFields) => {
    let detail: string[] = [];
    if (note.interestRate == undefined || note.interestRate <= 0) return "";
    detail.push(`${prettyPercent(note.interestRate)} APR`);
    if (note.interestStartDate !== undefined)
      detail.push(note.interestStartDate.toLocaleDateString());
    detail.push("-");
    if (note.conversionDate !== undefined)
      detail.push(note.conversionDate.toLocaleDateString());
    return detail.join(" ");
  };

  const handleInterestRateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseFloat(value);
    const datesRequired = typeof inputValue == "number" && inputValue > 0;
    const interestStartDateInput = document.querySelector(
      "input[name=interestStartDate]"
    ) as HTMLInputElement;
    if (interestStartDateInput) {
      interestStartDateInput.required = datesRequired;
      interestStartDateInput.disabled = !datesRequired;
    }
    const conversionDateInput = document.querySelector(
      "input[name=conversionDate]"
    ) as HTMLInputElement;
    if (conversionDateInput) {
      conversionDateInput.required = datesRequired;
      conversionDateInput.disabled = !datesRequired;
    }
  };

  return (
    <div>
      <fieldset className="mb-6">
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
                      onClick={() => handleRemoveNote(index)}
                    >
                      <TbTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </fieldset>

      <form onSubmit={handleAddNoteSubmit}>
        <legend>New Convertible Note</legend>
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <div>
              <Tooltip content="What is the name of the investor?">
                <Label>
                  Name
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput sizing="sm" name="name" required={true} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <Tooltip content="How much capital was invested?">
                <Label>
                  Principal Invested
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput
                sizing="sm"
                type="text"
                onChange={(e) => {
                  e.target.value = (
                    parseFloatInLocale(e.target.value) || ""
                  )?.toLocaleString();
                }}
                name="principalInvested"
                icon={TbCurrencyDollar}
                required={true}
              />
            </div>
            <div>
              <Tooltip content="What is the valuation discount this investor will receive relative to investors in this round?">
                <Label>
                  Conversion Discount
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput
                type="number"
                sizing="sm"
                name="conversionDiscount"
                rightIcon={TbPercentage}
                min={0}
                required={true}
              />
            </div>
            <div>
              <Tooltip content="What is the maximum valuation at which this note will convert into equity?">
                <Label>
                  Conversion Cap
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput
                sizing="sm"
                type="text"
                onChange={(e) => {
                  e.target.value = (
                    parseFloatInLocale(e.target.value) || ""
                  )?.toLocaleString();
                }}
                name="conversionCap"
                icon={TbCurrencyDollar}
                min={0}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <Tooltip content="What interest rate will be applied to the principal invested annually (if any)?">
                <Label>
                  Interest Rate
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput
                type="number"
                sizing="sm"
                name="interestRate"
                rightIcon={TbPercentage}
                min={0}
                onChange={handleInterestRateChange}
              />
            </div>
            <div>
              <Tooltip content="If it's being applied, when does interest start accruing?">
                <Label>
                  Interest Start Date
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput type="date" sizing="sm" name="interestStartDate" />
            </div>
            <div>
              <Tooltip content="If it's being applied, when does interest stop accruing?">
                <Label>
                  Conversion Date
                  <TbInfoCircle
                    className="m-1"
                    style={{ display: "inline", verticalAlign: "top" }}
                  />
                </Label>
              </Tooltip>
              <TextInput type="date" sizing="sm" name="conversionDate" />
            </div>
            <div className="">
              <Button size="xs" color="gray" type="submit">
                <TbRowInsertBottom className="mr-2 h-5 w-5" />
                <p>Save</p>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConvertibleNotesList;
