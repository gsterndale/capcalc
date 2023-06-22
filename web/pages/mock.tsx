import React, { useState, useRef, FormEvent } from "react";
import ProFormaCapTable from "../components/ProFormaCapTable";
import ScenarioComparisonTable from "../components/ScenarioComparisonTable";
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

const Playground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const tabsRef = useRef<TabsRef>(null);
  const props = { setActiveTab, tabsRef };

  return (
    <div className="mx-5 my-5">
      <div className="my-5">
        {/*
        TODO shrink the h1 and hide the p upon scroll
        */}
        <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-6xl dark:text-white">
          Equity Financing{" "}
          <span className="underline underline-offset-3 lg:decoration-8 md:decoration-6 sm:decoration-4 decoration-blue-400 dark:decoration-blue-600">
            Scenario Analysis
          </span>{" "}
          Tool
        </h1>
        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
          Evaluate the impact of different deal mechanics on each share class
          across a number of investment scenarios.
        </p>
      </div>

      <form>
        <Tabs.Group
          aria-label="Tabs"
          style="underline"
          className="justify-center min-w-fit"
          ref={props.tabsRef}
          onActiveTabChange={(tab) => props.setActiveTab(tab)}
        >
          <Tabs.Item active icon={TbCoin} title="New Round">
            <div className="flex justify-center">
              <h2 className="text-2xl dark:text-white mb-8 font-thin">
                First, share some background on the organization.
              </h2>
            </div>
            <div className="flex justify-center">
              <Card className="w-full md:w-1/2 lg:w-1/3">
                <fieldset>
                  <Label htmlFor="name">Name</Label>
                  <TextInput
                    name="name"
                    sizing="sm"
                    placeholder="Pied Piper LLC"
                  />
                  <Label htmlFor="newShareClass">New Share Class</Label>
                  <TextInput
                    name="newShareClass"
                    sizing="sm"
                    placeholder="Series A"
                  />
                </fieldset>
                <div className="flex gap-2 my-2 justify-end" role="group">
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(1)}
                  >
                    <p>Next</p>
                    <TbSquareRoundedArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </div>
          </Tabs.Item>

          <Tabs.Item icon={TbStack3} title="Share Classes">
            <div className="flex justify-center">
              <h2 className="text-2xl dark:text-white mb-8 font-thin">
                How many shares have been issued?
              </h2>
            </div>

            <div className="flex justify-center">
              <Card className="w-full md:w-1/2 lg:w-1/3">
                <fieldset>
                  <Table>
                    <Table.Head>
                      <Table.HeadCell className="py-1 px-4">
                        Share Class
                      </Table.HeadCell>
                      <Table.HeadCell className="py-1 px-4">
                        Shares
                      </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell className="py-1 px-4">
                          <Label>Founders:</Label>
                        </Table.Cell>
                        <Table.Cell className="py-1 px-4">
                          <TextInput
                            type="number"
                            sizing="sm"
                            name="foundersNumberOfShares"
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="py-1 px-4">
                          <Label>Common:</Label>
                        </Table.Cell>
                        <Table.Cell className="py-1 px-4">
                          <TextInput
                            type="number"
                            sizing="sm"
                            name="commonNumberOfShares"
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="py-1 px-4">
                          <Label>Warrants:</Label>
                        </Table.Cell>
                        <Table.Cell className="py-1 px-4">
                          <TextInput
                            type="number"
                            sizing="sm"
                            name="warrantsNumberOfShares"
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="py-1 px-4">
                          <Label>Granted Options:</Label>
                        </Table.Cell>
                        <Table.Cell className="py-1 px-4">
                          <TextInput
                            type="number"
                            sizing="sm"
                            name="grantedOptionsNumberOfShares"
                          />
                        </Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell className="py-1 px-4">
                          <Label>Old Options:</Label>
                        </Table.Cell>
                        <Table.Cell className="py-1 px-4">
                          <TextInput
                            type="number"
                            sizing="sm"
                            name="oldOptionsNumberOfShares"
                          />
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
                </fieldset>
                <div className="flex gap-2 my-2 justify-end" role="group">
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(0)}
                  >
                    <TbSquareRoundedArrowLeft className="mr-2 h-5 w-5" />
                    <p>Back</p>
                  </Button>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(2)}
                  >
                    <p>Next</p>
                    <TbSquareRoundedArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </div>
          </Tabs.Item>

          <Tabs.Item icon={TbFileDollar} title="Convertible Notes">
            <div className="flex justify-center">
              <h2 className="text-2xl dark:text-white mb-8 font-thin">
                What convertible notes are outstanding?
              </h2>
            </div>

            <div className="flex justify-center">
              <Card className="w-full md:w-3/4 lg:w-1/2">
                <fieldset>
                  <div className="flow-root">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1 items-center text-base font-semibold text-gray-900 dark:text-white">
                            Broad St Angels
                          </div>
                          <div className="">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              $1.2M 20% $5M Cap
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                              Jun 13, 2020 6% APR
                            </p>
                          </div>
                          <div className="">
                            <Button size="xs" color="gray">
                              <TbTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>

                      <li className="py-3 sm:py-4">
                        <div className="flex items-center space-x-4">
                          <div className="min-w-0 flex-1 items-center text-base font-semibold text-gray-900 dark:text-white">
                            BFTP
                          </div>
                          <div className="">
                            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                              $1.2M 20% $5M Cap
                            </p>
                            <p className="truncate text-sm text-gray-500 dark:text-gray-400"></p>
                          </div>
                          <div className="">
                            <Button size="xs" color="gray">
                              <TbTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </li>
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
                        <TextInput sizing="sm" name="name" />
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
                          rightIcon={TbLetterM}
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
                          rightIcon={TbLetterM}
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
                        <TextInput
                          type="date"
                          sizing="sm"
                          name="interestStartDate"
                        />
                      </div>
                      <div>
                        <Label value="Conversion Date" />
                        <TextInput
                          type="date"
                          sizing="sm"
                          name="conversionDate"
                        />
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
                <div className="flex gap-2 my-2 justify-end" role="group">
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(1)}
                  >
                    <TbSquareRoundedArrowLeft className="mr-2 h-5 w-5" />
                    <p>Back</p>
                  </Button>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(3)}
                  >
                    <p>Next</p>
                    <TbSquareRoundedArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </div>
          </Tabs.Item>

          <Tabs.Item icon={TbColumns3} title="Investment Scenarios">
            <div className="flex justify-center">
              <h2 className="text-2xl dark:text-white mb-8 font-thin">
                What investment scenarios are on the table?
              </h2>
            </div>

            <div className="flex justify-center">
              <Card className="w-full lg:w-3/4 min-w-fit">
                <fieldset>
                  <ScenarioComparisonTable />
                </fieldset>
                <div className="flex gap-2 my-2 justify-end" role="group">
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(2)}
                  >
                    <TbSquareRoundedArrowLeft className="mr-2 h-5 w-5" />
                    <p>Back</p>
                  </Button>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(4)}
                  >
                    <p>Next</p>
                    <TbSquareRoundedArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>
            </div>
          </Tabs.Item>
          <Tabs.Item icon={TbTable} title="Cap Table">
            <div className="flex justify-center gap-2">
              <h2 className="text-2xl dark:text-white mb-8 font-thin">
                Dig into the detailed Pro Forma Cap Table for
              </h2>
              <Select id="Scenario" sizing="sm" className="">
                <option selected>Scenario A: $10M @ $30M-PRE 20%ESOP</option>
                <option>Scenario B: $12M @ $28M-PRE 25%ESOP</option>
                <option>Scenario C: $12M @ $30M-PRE 20%ESOP</option>
              </Select>
            </div>

            <div className="flex justify-center">
              <Card className="w-full lg:w-3/4 min-w-fit">
                <ProFormaCapTable />
                <div className="flex gap-2 my-2 justify-end" role="group">
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(3)}
                  >
                    <TbSquareRoundedArrowLeft className="mr-2 h-5 w-5" />
                    <p>Back</p>
                  </Button>
                </div>
              </Card>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </form>
    </div>
  );
};

export default Playground;
