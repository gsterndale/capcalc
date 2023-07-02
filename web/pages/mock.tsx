import React, { useState, useRef, FormEvent } from "react";
import { CapTable, Organization, NoteFields } from "@capcalc/calc";
import ShareClassList from "../components/ShareClassList";
import ConvertibleNotesList from "../components/ConvertibleNotesList";
import ProFormaCapTable from "../components/ProFormaCapTable";
import ScenarioComparisonTable from "../components/ScenarioComparisonTable";
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
  TbLetterK,
  TbLetterM,
  TbSquareRoundedLetterA,
  TbSquareRoundedLetterB,
  TbSquareRoundedLetterC,
  TbSquareRoundedLetterD,
  TbCoin,
  TbFileDollar,
  TbFileSpreadsheet,
  TbDownload,
  TbArrowFork,
  TbGitFork,
  TbBusinessplan,
  TbLayoutRows,
  TbStack3,
} from "react-icons/tb";
import { prettyShares, prettyUSD } from "@capcalc/utils";

const initialOrganizationState: Organization = {
  notesFields: [
    {
      principalInvested: 200000,
      interestRate: 0.0,
      interestStartDate: new Date(2015, 1, 15),
      conversionCap: 3500000,
      conversionDiscount: 0.2,
      conversionDate: new Date(2023, 4, 15),
    },
    {
      principalInvested: 200000,
      interestRate: 0.0,
      interestStartDate: new Date(2015, 0, 3),
      conversionCap: 5500000,
      conversionDiscount: 0.1,
      conversionDate: new Date(2023, 4, 15),
    },
    {
      principalInvested: 200000,
      interestRate: 0.06,
      interestStartDate: new Date(2020, 10, 10),
      conversionCap: 8000000,
      conversionDiscount: 0.1,
      conversionDate: new Date(2023, 4, 15),
    },
    {
      principalInvested: 200000,
      interestRate: 0.06,
      interestStartDate: new Date(2015, 0, 3),
      conversionCap: 10000000,
      conversionDiscount: 0.2,
      conversionDate: new Date(2023, 4, 15),
    },
  ],

  newShareClass: "Series A",
  preMoneyValuation: 30000000,
  newMoneyRaised: 1000000,
  noteConversion: true,
  notesConvertToNewClass: true,
  expandOptionPool: true,
  postMoneyOptionPoolSize: 0.2,
  foundersNumberOfShares: 8000000,
  commonNumberOfShares: 1000000,
  warrantsNumberOfShares: 100000,
  grantedOptionsNumberOfShares: 800000,
  oldOptionsNumberOfShares: 100000,
};

const initialScenariosState: CapTable[] = [
  new CapTable(initialOrganizationState),
  new CapTable({ ...initialOrganizationState, newMoneyRaised: 2000000 }),
  new CapTable({
    ...initialOrganizationState,
    preMoneyValuation: 28000000,
    postMoneyOptionPoolSize: 0.15,
  }),
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [organization, setOrganization] = useState<Organization>(
    initialOrganizationState
  );
  const [scenarios, setScenarios] = useState<Array<CapTable>>(
    initialScenariosState
  );
  const tabsRef = useRef<TabsRef>(null);
  const props = { setActiveTab, tabsRef };

  const handleTabChange = (index: number) => {
    props.tabsRef.current?.setActiveTab(index);
  };

  const handleShareClassInputChange = (shareClass: {
    key: string;
    shares: number;
  }) => {
    const name = `${shareClass.key}NumberOfShares`;
    setOrganizationProperty(name, shareClass.shares);
  };

  const setOrganizationProperty = (name: string, value: any) => {
    // only if name is in common Organization props
    console.log({ orgChange: { name, value, organization } });

    setOrganization((prevOrganization) => {
      const newOrganization = {
        ...prevOrganization,
        [name]: value,
      };

      setScenarios((prevScenarios) =>
        prevScenarios.map((capTable) => new CapTable(newOrganization))
      );

      return newOrganization;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleOrganizationInputChange = (
    //React.FormEventHandler<HTMLFieldSetElement>
    event: React.FormEvent<HTMLFormElement> //React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseInput(value, type, checked);

    setOrganizationProperty(name, inputValue);
  };

  const [activeScenario, setActiveScenario] = useState<number>(0);
  const handleActiveScenarioChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const index = parseInt(event.target.value) || 0;
    setActiveScenario(index);
  };

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

      <form onSubmit={handleSubmit}>
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
                <fieldset onChange={handleOrganizationInputChange}>
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
                    value={organization.newShareClass}
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
              <Card className="w-full md:w-2/3 lg:w-1/2">
                <ShareClassList
                  handler={handleShareClassInputChange}
                  organization={organization}
                />
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
                <ConvertibleNotesList handler={setOrganizationProperty} />
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
                  <ScenarioComparisonTable
                    scenarios={scenarios}
                    handleTabChange={handleTabChange}
                    handleActiveScenarioChange={handleActiveScenarioChange}
                  />
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
              <Select
                id="Scenario"
                sizing="sm"
                className=""
                defaultValue={activeScenario}
                onChange={handleActiveScenarioChange}
              >
                {scenarios.map((capTable, index) => (
                  <option value={index} key={index}>
                    {capTable.organization.newShareClass}:{" "}
                    {prettyUSD(capTable.organization.newMoneyRaised)} @{" "}
                    {prettyUSD(capTable.organization.preMoneyValuation)}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex justify-center">
              <Card className="w-full lg:w-3/4 min-w-fit">
                <ProFormaCapTable capTable={scenarios[activeScenario]} />
                <div className="flex gap-2 my-2 justify-end" role="group">
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => props.tabsRef.current?.setActiveTab(3)}
                  >
                    <TbSquareRoundedArrowLeft className="mr-2 h-5 w-5" />
                    <p>Back</p>
                  </Button>
                  <Button size="sm" color="gray">
                    <TbDownload className="mr-2 h-5 w-5" />
                    <p>Export</p>
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

export default App;
