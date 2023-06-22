import React from "react";
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
  TbLetterK,
  TbLetterM,
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

const ScenarioComparisonTable: React.FC = () => {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell colSpan={2} className="text-right">
          Scenario
        </Table.HeadCell>
        <Table.HeadCell>
          <a href="#" className="inline-flex items-center justify-center gap-1">
            <TbSquareRoundedLetterA className="h-6 w-6" title="A" />
          </a>
        </Table.HeadCell>
        <Table.HeadCell>
          <a href="#" className="inline-flex items-center justify-center gap-1">
            <TbSquareRoundedLetterB className="h-6 w-6" title="B" />
          </a>
        </Table.HeadCell>
        <Table.HeadCell>
          <a href="#" className="inline-flex items-center justify-center gap-1">
            <TbSquareRoundedLetterC className="h-6 w-6" title="C" />
          </a>
        </Table.HeadCell>
        <Table.HeadCell>
          <a href="#" className="inline-flex items-center justify-center gap-1">
            <TbSquareRoundedLetterD className="h-6 w-6" title="D" />
          </a>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <Table.Cell rowSpan={7}>Deal mechanics</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>New Money Raised</Table.Cell>
          <Table.Cell>$10M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">$12M</Table.Cell>
          <Table.Cell>$12M</Table.Cell>
          <Table.Cell className="w-44">
            <TextInput
              sizing="sm"
              type="number"
              name="newMoneyRaised"
              icon={TbCurrencyDollar}
              rightIcon={TbLetterM}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Pre-Money Valuation</Table.Cell>
          <Table.Cell>$30M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">$28M</Table.Cell>
          <Table.Cell>$30M</Table.Cell>
          <Table.Cell>
            <TextInput
              sizing="sm"
              type="number"
              name="preMoneyValuation"
              icon={TbCurrencyDollar}
              rightIcon={TbLetterM}
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Post-Money Option Pool Size</Table.Cell>
          <Table.Cell>20%</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">25%</Table.Cell>
          <Table.Cell>20%</Table.Cell>
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
          <Table.Cell>Notes Convert</Table.Cell>
          <Table.Cell>
            <TbCheck />
          </Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            <TbCheck />
          </Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            <Checkbox name="noteConversion" id="noteConversion" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Notes Convert to New Class</Table.Cell>
          <Table.Cell>
            <TbCheck />
          </Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800"></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            <Checkbox
              name="notesConvertToNewClass"
              id="notesConvertToNewClass"
            />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Expand Option Pool</Table.Cell>
          <Table.Cell>
            <TbCheck />
          </Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            <TbCheck />
          </Table.Cell>
          <Table.Cell>
            <TbCheck />
          </Table.Cell>
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
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
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
              >
                <option selected>Founders</option>
                <option>Common</option>
                <option>Warrants</option>
                <option>Notes</option>
                <option>New Money</option>
                <option>Grants</option>
                <option>Old Pool</option>
                <option>New Pool</option>
              </Select>
            </div>
            <div className="w-2/5 text-left">share class</div>
          </div>
        </Table.HeadCell>
      </Table.Head>
      <Table.Body className="border-b">
        <Table.Row>
          <Table.Cell rowSpan={4}>Pre-Money</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Shares</Table.Cell>
          <Table.Cell>8M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">8M</Table.Cell>
          <Table.Cell>8M</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ownership %</Table.Cell>
          <Table.Cell>80%</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">80%</Table.Cell>
          <Table.Cell>80%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ownership Value at $3.00/Share</Table.Cell>
          <Table.Cell>$24M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            $22.2M
          </Table.Cell>
          <Table.Cell>$24M</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Body>
        <Table.Row>
          <Table.Cell rowSpan={7}>Post-Money</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Shares</Table.Cell>
          <Table.Cell>8M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">8M</Table.Cell>
          <Table.Cell>8M</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ownership %</Table.Cell>
          <Table.Cell>57.4%</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            52.9%
          </Table.Cell>
          <Table.Cell>55.4%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>% Change</Table.Cell>
          <Table.Cell>-22.6%</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            -27.1%
          </Table.Cell>
          <Table.Cell>-24.6%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Ownership Value at $2.18/Share</Table.Cell>
          <Table.Cell>$17.8M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            $15.9M
          </Table.Cell>
          <Table.Cell>$18.2M</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Value Change</Table.Cell>
          <Table.Cell>-$6.2M</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            -$6.3M
          </Table.Cell>
          <Table.Cell>$5.8M</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Dilution</Table.Cell>
          <Table.Cell>-28.5%</Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            -33.9%
          </Table.Cell>
          <Table.Cell>-30.8%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell colSpan={2}></Table.Cell>
          <Table.Cell>
            <Button
              size="xs"
              color="gray"
              onClick={() => props.tabsRef.current?.setActiveTab(4)}
            >
              <TbTable className="mr-2 h-4 w-4" />
              <p>Cap Table</p>
            </Button>
          </Table.Cell>
          <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
            <Button
              size="xs"
              color="gray"
              onClick={() => props.tabsRef.current?.setActiveTab(4)}
            >
              <TbTable className="mr-2 h-4 w-4" />
              <p>Cap Table</p>
            </Button>
          </Table.Cell>
          <Table.Cell>
            <Button
              size="xs"
              color="gray"
              onClick={() => props.tabsRef.current?.setActiveTab(4)}
            >
              <TbTable className="mr-2 h-4 w-4" />
              <p>Cap Table</p>
            </Button>
          </Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default ScenarioComparisonTable;
