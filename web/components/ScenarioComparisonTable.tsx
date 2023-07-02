import React, { useState } from "react";
import { Button, TextInput, Checkbox, Table, Select } from "flowbite-react";
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
import { CapTable, ShareClass, type Organization } from "@capcalc/calc";
import { prettyPercent, prettyShares, prettyUSD } from "@capcalc/utils";

type scenarioColumn = {
  key: number;
  letter: string;

  description: string;
  preMoneyValuation: number;
  newMoneyRaised: number;
  noteConversion: boolean;
  notesConvertToNewClass: boolean;
  expandOptionPool: boolean;
  postMoneyOptionPoolSize: number;

  preMoneySharePrice: number;
  preMoneyShares: number;
  postMoneyShares: number;
  preMoneyPercentOwnership: number;
  preMoneyOwnershipValue: number;

  postMoneySharePrice: number;
  postMoneyPercentOwnership: number;
  postMoneyOwnershipValue: number;
  postMoneyPercentChange: number;
  postMoneyValueChange: number;
  postMoneyDilution: number;
};

type AppProps = {
  scenarios: CapTable[];
  handleTabChange: Function;
  handleActiveScenarioChange: Function;
};
const initialShareClassName = "Founders' Shares";

const ScenarioComparisonTable: React.FC<AppProps> = (props: AppProps) => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  const checkmark = (bool: Boolean) => {
    if (!bool) return "";
    return <TbCheck className="inline-flex" />;
  };

  const [shareClassName, setShareClassName] = useState<string>(
    initialShareClassName
  );
  const handleShareClassNameInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    setShareClassName((prevState) => value);
  };

  const scenarioColumns: scenarioColumn[] = props.scenarios.map(
    (capTable: CapTable, index) => {
      const shareClass = capTable
        .shareClasses()
        .find((obj) => obj.name === shareClassName);
      if (shareClass === undefined)
        throw new Error(`ShareClass named ${shareClassName} not found.`);

      return {
        key: index,
        letter: alphabet[index],

        description: `Ideal`,
        preMoneyValuation: capTable.organization.preMoneyValuation,
        newMoneyRaised: capTable.organization.newMoneyRaised,
        noteConversion: true,
        notesConvertToNewClass: true,
        expandOptionPool: true,
        postMoneyOptionPoolSize: 1,

        preMoneySharePrice: capTable.preMoneySharePrice(),
        preMoneyShares: shareClass.preMoneyShares,
        preMoneyPercentOwnership: shareClass.preMoneyPercentOwnership(
          capTable.totalPreMoneyShares()
        ),
        preMoneyOwnershipValue: shareClass.preMoneyOwnershipValue(
          capTable.preMoneySharePrice()
        ),

        postMoneyShares: shareClass.postMoneyShares,
        postMoneySharePrice: capTable.sharePriceForFinancing(),
        postMoneyPercentOwnership: shareClass.postMoneyPercentOwnership(
          capTable.totalPostMoneyShares()
        ),
        postMoneyOwnershipValue: shareClass.postMoneyOwnershipValue(
          capTable.sharePriceForFinancing()
        ),
        postMoneyPercentChange: shareClass.postMoneyPercentChange(
          capTable.totalPostMoneyShares(),
          capTable.totalPreMoneyShares()
        ),
        postMoneyValueChange: shareClass.postMoneyValueChange(
          capTable.sharePriceForFinancing(),
          capTable.preMoneySharePrice()
        ),
        postMoneyDilution: shareClass.postMoneyDilution(
          capTable.totalPostMoneyShares(),
          capTable.totalPreMoneyShares()
        ),
      };
    }
  );

  return (
    <Table className="font-mono text-right">
      <Table.Head>
        <Table.HeadCell colSpan={2} className="text-right">
          Scenario
        </Table.HeadCell>
        {scenarioColumns.map((col) => (
          <Table.HeadCell key={col.key}>
            <a href="#" className="inline-flex">
              {col.letter}
            </a>
          </Table.HeadCell>
        ))}
        <Table.HeadCell>
          <a href="#" className="inline-flex">
            {alphabet[props.scenarios.length]}
          </a>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell rowSpan={8} className="text-left">
            Deal mechanics
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Description</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>{col.description}</Table.Cell>
          ))}
          <Table.Cell className="w-44">
            <TextInput sizing="sm" name="description" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">New Money Raised</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>{prettyUSD(col.newMoneyRaised)}</Table.Cell>
          ))}
          <Table.Cell className="w-44">
            <TextInput
              sizing="sm"
              type="number"
              name="newMoneyRaised"
              icon={TbCurrencyDollar}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Pre-Money Valuation</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyUSD(col.preMoneyValuation)}
            </Table.Cell>
          ))}
          <Table.Cell>
            <TextInput
              sizing="sm"
              type="number"
              name="preMoneyValuation"
              icon={TbCurrencyDollar}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">
            Post-Money Option Pool Size
          </Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyPercent(col.postMoneyOptionPoolSize, 0)}
            </Table.Cell>
          ))}
          <Table.Cell>
            <TextInput
              sizing="sm"
              type="number"
              name="postMoneyOptionPoolSize"
              rightIcon={TbPercentage}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Notes Convert</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>{checkmark(col.noteConversion)}</Table.Cell>
          ))}
          <Table.Cell>
            <Checkbox name="noteConversion" id="noteConversion" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">
            Notes Convert to New Class
          </Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {checkmark(col.notesConvertToNewClass)}
            </Table.Cell>
          ))}
          <Table.Cell>
            <Checkbox
              name="notesConvertToNewClass"
              id="notesConvertToNewClass"
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Expand Option Pool</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {checkmark(col.expandOptionPool)}
            </Table.Cell>
          ))}
          <Table.Cell>
            <Checkbox name="expandOptionPool" id="expandOptionPool" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan={2}></Table.Cell>
          <Table.Cell>
            <div className="inline-flex" role="group">
              <Button size="xs" color="gray">
                <TbPencil className="mr-2 h-4 w-4" />
                <p>Edit</p>
              </Button>
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="inline-flex" role="group">
              <Button size="xs" color="gray">
                <TbPencil className="mr-2 h-4 w-4" />
                <p>Edit</p>
              </Button>
            </div>
          </Table.Cell>
          <Table.Cell>
            <div className="inline-flex" role="group">
              <Button size="xs" color="gray">
                <TbPencil className="mr-2 h-4 w-4" />
                <p>Edit</p>
              </Button>
            </div>
          </Table.Cell>
          <Table.Cell>
            <Button size="xs" color="gray">
              <TbColumnInsertRight className="mr-2 h-5 w-5" />
              <p>Save</p>
            </Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Head>
        <Table.HeadCell colSpan={6} className="text-center">
          <div className="flex items-center gap-1">
            <div className="w-2/5 text-right">Capitalization metrics for</div>
            <div className="w-1/5 text-left">
              <Select
                id="ShareClass"
                sizing="sm"
                className="display-inline w-auto"
                defaultValue={0}
                onChange={handleShareClassNameInputChange}
              >
                <option>Founders' Shares</option>
                <option>Rest of Common</option>
                <option>Warrants</option>
                <option>Convertible Notes Into New Share Class</option>
                <option>New Money Equity</option>
                <option>Granted Options</option>
                <option>Options Available before</option>
                <option>New Options for Pool</option>
              </Select>
            </div>
            <div className="w-2/5 text-left">share class</div>
          </div>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="border-b">
        <Table.Row>
          <Table.Cell rowSpan={5} className="text-left">
            Pre-Money
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Shares</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyShares(col.preMoneyShares)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Ownership %</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyPercent(col.preMoneyPercentOwnership)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Share Price</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyUSD(col.preMoneySharePrice, 2)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Ownership Value</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyUSD(col.preMoneyOwnershipValue)}
            </Table.Cell>
          ))}
        </Table.Row>
      </Table.Body>
      <Table.Body>
        <Table.Row>
          <Table.Cell rowSpan={8} className="text-left">
            Post-Money
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Shares</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyShares(col.postMoneyShares)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Ownership %</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyPercent(col.postMoneyPercentOwnership)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">% Change</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyPercent(col.postMoneyPercentChange)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Share Price</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyUSD(col.postMoneySharePrice, 2)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Ownership Value</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyUSD(col.postMoneyOwnershipValue)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Value Change</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyUSD(col.postMoneyValueChange)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Dilution</Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell key={index}>
              {prettyPercent(col.postMoneyDilution)}
            </Table.Cell>
          ))}
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan={2}></Table.Cell>
          {scenarioColumns.map((col, index) => (
            <Table.Cell>
              <Button
                size="xs"
                color="gray"
                onClick={() => {
                  props.handleActiveScenarioChange(index);
                  props.handleTabChange(4);
                }}
              >
                <TbTable className="mr-2 h-4 w-4" />
                <p>Cap Table</p>
              </Button>
            </Table.Cell>
          ))}
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default ScenarioComparisonTable;