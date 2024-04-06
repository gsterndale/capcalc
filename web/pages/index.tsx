import React, { useState, useRef, FormEvent } from "react";
import Head from "next/head";
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
  Tooltip,
} from "flowbite-react";
import {
  TbCopy,
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
      name: "Generic",
      principalInvested: 100000,
      interestRate: 0.0,
      interestStartDate: new Date(2020, 0, 1),
      conversionCap: 5000000,
      conversionDiscount: 0.2,
      conversionDate: new Date(2025, 0, 1),
    },
  ],

  name: "Pied Piper, LLC",
  description: "Ideal",
  newShareClass: "Series A",
  preMoneyValuation: 30000000,
  newMoneyRaised: 1000000,
  noteConversion: true,
  expandOptionPool: true,
  postMoneyOptionPoolSize: 0.2,
  foundersNumberOfShares: 8000000,
  commonNumberOfShares: 1000000,
  warrantsNumberOfShares: 100000,
  grantedOptionsNumberOfShares: 800000,
  oldOptionsNumberOfShares: 100000,
};

const initialScenariosState: CapTable[] = [
  new CapTable({ ...initialOrganizationState, description: "Small" }),
  new CapTable({
    ...initialOrganizationState,
    newMoneyRaised: 2000000,
    description: "Large",
  }),
  new CapTable({
    ...initialOrganizationState,
    preMoneyValuation: 28000000,
    postMoneyOptionPoolSize: 0.15,
    description: "Small & Low",
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

  const handleCopy = (selector: string) => {
    const node = document.querySelector(selector);
    if (node === null) return;
    const blob = new Blob([node.outerHTML], { type: "text/html" });
    let data = [new ClipboardItem({ [blob.type]: blob })];
    navigator.clipboard.write(data).then(
      () => console.log("Copied"),
      (err) => console.log("Error while copying")
    );
  };

  const handleShareClassInputChange = (shareClass: {
    key: string;
    shares: number;
  }) => {
    const name = `${shareClass.key}NumberOfShares`;
    setOrganizationProperty(name, shareClass.shares);
  };

  const handleAddNoteFields = (noteFields: NoteFields) => {
    const notesFields = organization.notesFields.concat(noteFields);
    setOrganizationProperty("notesFields", notesFields);
  };

  const handleRemoveNoteFields = (index: number) => {
    const notesFields = organization.notesFields.filter((_, i) => i !== index);
    setOrganizationProperty("notesFields", notesFields);
  };

  const pick = <T extends {}, K extends keyof T>(obj: T, ...keys: K[]) =>
    Object.fromEntries(
      keys.filter((key) => key in obj).map((key) => [key, obj[key]])
    ) as Pick<T, K>;

  const setOrganizationProperty = (name: string, value: any) => {
    setOrganization((prevOrganization) => {
      const newOrganization = {
        ...prevOrganization,
        [name]: value,
      };

      setScenarios((prevScenarios) => {
        const commonProps = pick(
          newOrganization,
          "newShareClass",
          "foundersNumberOfShares",
          "commonNumberOfShares",
          "warrantsNumberOfShares",
          "grantedOptionsNumberOfShares",
          "oldOptionsNumberOfShares"
        );

        return prevScenarios.map((capTable) => {
          const prevOrg = capTable.organization;
          return new CapTable({ ...prevOrg, ...commonProps });
        });
      });

      return newOrganization;
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const handleOrganizationInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseInput(value, type, checked);

    setOrganizationProperty(name, inputValue);
  };

  const [activeScenario, setActiveScenario] = useState<number>(0);
  const handleActiveScenarioInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const index = parseInt(event.target.value) || 0;
    handleActiveScenarioChange(index);
  };
  const handleActiveScenarioChange = (index: number) => {
    setActiveScenario(index);
  };

  const handleAddScenario = (orgPart: Organization) => {
    const fullOrg: Organization = { ...organization, ...orgPart };
    const newScenario: CapTable = new CapTable(fullOrg);
    setScenarios((prevScenarios) => {
      return prevScenarios.concat(newScenario);
    });
  };

  const handleRemoveScenario = (index: number) => {
    setScenarios((prevScenarios) => {
      return prevScenarios.filter((_, i) => i !== index);
    });
  };

  return (
    <div className="mx-5 my-5">
      <div className="my-5">
        <Head>
          <title>Equity Financing Scenario Analysis Tool</title>
          <meta
            property="og:title"
            content="Equity Financing Scenario Analysis Tool"
            key="title"
          />
        </Head>
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

      <Tabs
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
              <form onSubmit={handleSubmit}>
                <fieldset>
                  <Tooltip content="What is the name of your venture?">
                    <Label htmlFor="name">
                      Name
                      <TbInfoCircle
                        className="m-1"
                        style={{ display: "inline", verticalAlign: "top" }}
                      />
                    </Label>
                  </Tooltip>
                  <TextInput
                    name="name"
                    sizing="sm"
                    placeholder="Pied Piper LLC"
                    value={organization.name}
                    onChange={handleOrganizationInputChange}
                  />
                  <Tooltip content="What are you calling this new round of funding?">
                    <Label htmlFor="newShareClass">
                      New Share Class
                      <TbInfoCircle
                        className="m-1"
                        style={{ display: "inline", verticalAlign: "top" }}
                      />
                    </Label>
                  </Tooltip>
                  <TextInput
                    name="newShareClass"
                    sizing="sm"
                    placeholder="Series A"
                    value={organization.newShareClass}
                    onChange={handleOrganizationInputChange}
                  />
                </fieldset>
              </form>
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
              <ConvertibleNotesList
                notesFields={organization.notesFields}
                handleAddNoteFields={handleAddNoteFields}
                handleRemoveNoteFields={handleRemoveNoteFields}
              />
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
              <ScenarioComparisonTable
                scenarios={scenarios}
                handleTabChange={handleTabChange}
                handleActiveScenarioChange={handleActiveScenarioChange}
                handleAddScenario={handleAddScenario}
                handleRemoveScenario={handleRemoveScenario}
              />
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
                  onClick={() => handleCopy("#scenarioComparisonTable")}
                >
                  <TbCopy className="mr-2 h-5 w-5" />
                  <p>Copy</p>
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
              {scenarios.length > 0
                ? "Dig into the detailed Pro Forma Cap Table for"
                : "Create an Investment Scenario in order to view its Pro Forma Cap Table"}
            </h2>
            {scenarios.length > 0 && (
              <Select
                id="Scenario"
                sizing="sm"
                className=""
                value={activeScenario}
                onChange={handleActiveScenarioInputChange}
              >
                {scenarios.map((capTable, index) => (
                  <option value={index} key={index}>
                    {capTable.organization.description}:{" "}
                    {prettyUSD(capTable.organization.newMoneyRaised)} @{" "}
                    {prettyUSD(capTable.organization.preMoneyValuation)}
                  </option>
                ))}
              </Select>
            )}
          </div>

          {scenarios.length > 0 && (
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
                  <Button
                    size="sm"
                    color="gray"
                    onClick={() => handleCopy("#proFormaCapTable")}
                  >
                    <TbCopy className="mr-2 h-5 w-5" />
                    <p>Copy</p>
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </Tabs.Item>
      </Tabs>
    </div>
  );
};

export default App;
