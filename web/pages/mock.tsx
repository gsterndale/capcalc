import React, { useState, useRef, FormEvent } from "react";
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
                  <Table>
                    <Table.Head>
                      <Table.HeadCell colSpan={2} className="text-right">
                        Scenario
                      </Table.HeadCell>
                      <Table.HeadCell>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center gap-1"
                        >
                          <TbSquareRoundedLetterA
                            className="h-6 w-6"
                            title="A"
                          />
                        </a>
                      </Table.HeadCell>
                      <Table.HeadCell>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center gap-1"
                        >
                          <TbSquareRoundedLetterB
                            className="h-6 w-6"
                            title="B"
                          />
                        </a>
                      </Table.HeadCell>
                      <Table.HeadCell>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center gap-1"
                        >
                          <TbSquareRoundedLetterC
                            className="h-6 w-6"
                            title="C"
                          />
                        </a>
                      </Table.HeadCell>
                      <Table.HeadCell>
                        <a
                          href="#"
                          className="inline-flex items-center justify-center gap-1"
                        >
                          <TbSquareRoundedLetterD
                            className="h-6 w-6"
                            title="D"
                          />
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
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          $12M
                        </Table.Cell>
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
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          $28M
                        </Table.Cell>
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
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          25%
                        </Table.Cell>
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
                          <Checkbox
                            name="expandOptionPool"
                            id="expandOptionPool"
                          />
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
                          <div className="w-2/5 text-right">
                            Capitalization metrics for
                          </div>
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
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          8M
                        </Table.Cell>
                        <Table.Cell>8M</Table.Cell>
                      </Table.Row>
                      <Table.Row>
                        <Table.Cell>Ownership %</Table.Cell>
                        <Table.Cell>80%</Table.Cell>
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          80%
                        </Table.Cell>
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
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          8M
                        </Table.Cell>
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
                            onClick={() =>
                              props.tabsRef.current?.setActiveTab(4)
                            }
                          >
                            <TbTable className="mr-2 h-4 w-4" />
                            <p>Cap Table</p>
                          </Button>
                        </Table.Cell>
                        <Table.Cell className=" bg-gray-50 dark:bg-gray-800">
                          <Button
                            size="xs"
                            color="gray"
                            onClick={() =>
                              props.tabsRef.current?.setActiveTab(4)
                            }
                          >
                            <TbTable className="mr-2 h-4 w-4" />
                            <p>Cap Table</p>
                          </Button>
                        </Table.Cell>
                        <Table.Cell>
                          <Button
                            size="xs"
                            color="gray"
                            onClick={() =>
                              props.tabsRef.current?.setActiveTab(4)
                            }
                          >
                            <TbTable className="mr-2 h-4 w-4" />
                            <p>Cap Table</p>
                          </Button>
                        </Table.Cell>
                        <Table.Cell></Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>
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
            <div className="flex justify-center">
              <h2 className="text-2xl dark:text-white mb-8 font-thin">
                Dig into the detailed Cap Table for any scenario.
              </h2>
            </div>

            <div className="flex justify-center">
              <Card className="w-full lg:w-3/4 min-w-fit">
                <Table hoverable>
                  <caption>
                    <div className="mb-1 md:flex items-center md:w-1/2 gap-1">
                      <div className="w-1/2 md:text-right">
                        Pro Forma Capitalization Table for
                      </div>
                      <div className="w-1/2 text-left">
                        <Select
                          id="Scenario"
                          sizing="sm"
                          className="display-inline w-auto"
                        >
                          <option selected>
                            Scenario A: $10M @ $30M-PRE 20%ESOP
                          </option>
                          <option>Scenario B: $12M @ $28M-PRE 25%ESOP</option>
                          <option>Scenario C: $12M @ $30M-PRE 20%ESOP</option>
                        </Select>
                      </div>
                    </div>
                  </caption>
                  <Table.Head>
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell colSpan={3}>
                      Pre-Money $3.00/share
                    </Table.HeadCell>
                    <Table.HeadCell colSpan={6} className="border-l">
                      Post-Money $2.18/share
                    </Table.HeadCell>
                  </Table.Head>
                  <Table.Head>
                    <Table.HeadCell></Table.HeadCell>
                    <Table.HeadCell>Shares</Table.HeadCell>
                    <Table.HeadCell>Ownership %</Table.HeadCell>
                    <Table.HeadCell>Ownership Value</Table.HeadCell>
                    <Table.HeadCell className="border-l">Shares</Table.HeadCell>
                    <Table.HeadCell>Ownership %</Table.HeadCell>
                    <Table.HeadCell>% Change</Table.HeadCell>
                    <Table.HeadCell>Ownership Value</Table.HeadCell>
                    <Table.HeadCell>Value Change</Table.HeadCell>
                    <Table.HeadCell>Dilution</Table.HeadCell>
                  </Table.Head>
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>Founders</Table.Cell>
                      <Table.Cell>8M</Table.Cell>
                      <Table.Cell>80.0%</Table.Cell>
                      <Table.Cell>$24M</Table.Cell>
                      <Table.Cell className="border-l">8M</Table.Cell>
                      <Table.Cell>57.4%</Table.Cell>
                      <Table.Cell>-22.6%</Table.Cell>
                      <Table.Cell>$18M</Table.Cell>
                      <Table.Cell>-$6M</Table.Cell>
                      <Table.Cell>-28.2%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Common</Table.Cell>
                      <Table.Cell>1M</Table.Cell>
                      <Table.Cell>10.0%</Table.Cell>
                      <Table.Cell>$3M</Table.Cell>
                      <Table.Cell className="border-l">1M</Table.Cell>
                      <Table.Cell>7.2%</Table.Cell>
                      <Table.Cell>-2.8%</Table.Cell>
                      <Table.Cell>$2.2M</Table.Cell>
                      <Table.Cell>-$78K</Table.Cell>
                      <Table.Cell>-28.2%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Warrants</Table.Cell>
                      <Table.Cell>100K</Table.Cell>
                      <Table.Cell>1.0%</Table.Cell>
                      <Table.Cell>$300K</Table.Cell>
                      <Table.Cell className="border-l">100K</Table.Cell>
                      <Table.Cell>0.7%</Table.Cell>
                      <Table.Cell>-0.3%</Table.Cell>
                      <Table.Cell>$222K</Table.Cell>
                      <Table.Cell>-$78K</Table.Cell>
                      <Table.Cell>-28.2%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Notes</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell className="border-l">1M</Table.Cell>
                      <Table.Cell>7.2%</Table.Cell>
                      <Table.Cell>7.2%</Table.Cell>
                      <Table.Cell>$2.2M</Table.Cell>
                      <Table.Cell>$2.2M</Table.Cell>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>New Money</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell className="border-l">449K</Table.Cell>
                      <Table.Cell>3.2%</Table.Cell>
                      <Table.Cell>3.2%</Table.Cell>
                      <Table.Cell>$1M</Table.Cell>
                      <Table.Cell>$1M</Table.Cell>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Grants</Table.Cell>
                      <Table.Cell>800K</Table.Cell>
                      <Table.Cell>8.0%</Table.Cell>
                      <Table.Cell>$2.4M</Table.Cell>
                      <Table.Cell className="border-l">800K</Table.Cell>
                      <Table.Cell>5.7%</Table.Cell>
                      <Table.Cell>-2.3%</Table.Cell>
                      <Table.Cell>$1.8M</Table.Cell>
                      <Table.Cell>-$620K</Table.Cell>
                      <Table.Cell>-28.2%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>Old Pool</Table.Cell>
                      <Table.Cell>100K</Table.Cell>
                      <Table.Cell>1.0%</Table.Cell>
                      <Table.Cell>$300K</Table.Cell>
                      <Table.Cell className="border-l">100K</Table.Cell>
                      <Table.Cell>0.7%</Table.Cell>
                      <Table.Cell>-0.3%</Table.Cell>
                      <Table.Cell>$222K</Table.Cell>
                      <Table.Cell>-$78K</Table.Cell>
                      <Table.Cell>-28.2%</Table.Cell>
                    </Table.Row>
                    <Table.Row>
                      <Table.Cell>New Pool</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell>0</Table.Cell>
                      <Table.Cell className="border-l">2.5M</Table.Cell>
                      <Table.Cell>17.8%</Table.Cell>
                      <Table.Cell>17.8%</Table.Cell>
                      <Table.Cell>$5.5M</Table.Cell>
                      <Table.Cell>$5.5M</Table.Cell>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  </Table.Body>
                  <tfoot className="border-t">
                    <Table.Row>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>10M</Table.Cell>
                      <Table.Cell>100%</Table.Cell>
                      <Table.Cell>$30M</Table.Cell>
                      <Table.Cell className="border-l">13.9M</Table.Cell>
                      <Table.Cell>100%</Table.Cell>
                      <Table.Cell></Table.Cell>
                      <Table.Cell>$31M</Table.Cell>
                      <Table.Cell>$1M</Table.Cell>
                      <Table.Cell></Table.Cell>
                    </Table.Row>
                  </tfoot>
                </Table>
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
