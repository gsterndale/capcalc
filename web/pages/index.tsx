import React, { useState, FormEvent } from 'react';
import { CapTable, Organization, NoteFields } from '@capcalc/calc';
import { asShares, asUSD, asPercent } from '@capcalc/utils';
import { Table, Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { TbTable, TbTrash, TbRowInsertBottom } from "react-icons/tb";

const initialOrganizationState: Organization = {
  newShareClass: '',
  preMoneyValuation: 30000000,
  newMoneyRaised: 1000000,
  noteConversion: false,
  notesConvertToNewClass: false,
  expandOptionPool: false,
  postMoneyOptionPoolSize: 0.2,
  notesFields: [],
  foundersNumberOfShares: 8000000,
  commonNumberOfShares: 1000000,
  warrantsNumberOfShares: 100000,
  grantedOptionsNumberOfShares: 800000,
  oldOptionsNumberOfShares: 100000,
};

const initialNoteFieldsState: NoteFields = {
  principalInvested: 500000,
  conversionDiscount: 0.2,
  conversionDate: undefined,
  interestRate: undefined,
  interestStartDate: undefined,
  conversionCap: 5000000,
};

const App: React.FC = () => {
  const [organization, setOrganization] = useState<Organization>(
    initialOrganizationState
  );
  const [noteFields, setNoteFields] = useState<NoteFields>(
    initialNoteFieldsState
  );
  const [capTable, setCapTable] = useState<CapTable | null>(null);

  const inputDateFormat = (value: Date|undefined): string => {
    if(value instanceof Date){
      return new Date(value.getTime() - (value.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
    } else {
      return value ? value : "";
    }
  }
  const parseInput = (value: string, type: string, checked: boolean|undefined): number | string | Date | boolean | undefined => {
    switch (type) {
      case "checkbox":
        return !!(checked);
      case "number":
        return value === "" ? undefined : parseFloat(value);
      case "date":
        if(value === ""){
          return undefined;
        }else{
          const date = new Date(value);
          date.setHours(24);
          return date;
        }
      default:
        return value;
    }
  }

  const handleOrganizationInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseInput(value, type, checked)

    setOrganization((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const handleNoteFieldsInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target;

    const inputValue = parseInput(value, type, checked)

    setNoteFields((prevState) => ({
      ...prevState,
      [name]: inputValue,
    }));
  };

  const addNoteField = () => {
    setOrganization((prevState) => ({
      ...prevState,
      notesFields: [...prevState.notesFields, noteFields],
    }));
    setNoteFields(initialNoteFieldsState);
  };

  const removeNoteField = (index: number) => {
    setOrganization((prevState) => {
      const updatedNotesFields = prevState.notesFields.filter(
        (_, i) => i !== index
      );
      return {
        ...prevState,
        notesFields: updatedNotesFields,
      };
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newCapTable = new CapTable(organization);
    console.log(JSON.stringify(organization))
    console.log({organization: organization, shareClasses: newCapTable.shareClasses(), preMoneySharePrice: newCapTable.preMoneySharePrice(), spff: newCapTable.sharePriceForFinancing()});
    setCapTable(newCapTable);
  };

  return (
    <div>
      
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <div>
          <div>Organization</div>
          <Label htmlFor="newShareClass"> New Share Class:</Label>
          <TextInput name="newShareClass" value={organization.newShareClass} onChange={handleOrganizationInputChange} />
          <Label>Pre-Money Valuation:</Label>
          <TextInput type="number" name="preMoneyValuation" value={organization.preMoneyValuation} onChange={handleOrganizationInputChange} />
          <Label>New Money Raised:</Label>
          <TextInput type="number" name="newMoneyRaised" value={organization.newMoneyRaised} onChange={handleOrganizationInputChange} />
          <Label>Post-Money Option Pool Size:</Label>
          <TextInput type="number" name="postMoneyOptionPoolSize" value={organization.postMoneyOptionPoolSize} onChange={handleOrganizationInputChange} />
          <Label>Founders Number of Shares:</Label>
          <TextInput type="number" name="foundersNumberOfShares" value={organization.foundersNumberOfShares} onChange={handleOrganizationInputChange} />
          <Label>Common Number of Shares:</Label>
          <TextInput type="number" name="commonNumberOfShares" value={organization.commonNumberOfShares} onChange={handleOrganizationInputChange} />
          <Label>Warrants Number of Shares:</Label>
          <TextInput type="number" name="warrantsNumberOfShares" value={organization.warrantsNumberOfShares} onChange={handleOrganizationInputChange} />
          <Label>Granted Options Number of Shares:</Label>
          <TextInput type="number" name="grantedOptionsNumberOfShares" value={organization.grantedOptionsNumberOfShares} onChange={handleOrganizationInputChange} />
          <Label>Old Options Number of Shares:</Label>
          <TextInput type="number" name="oldOptionsNumberOfShares" value={organization.oldOptionsNumberOfShares} onChange={handleOrganizationInputChange} />
          <Label>Note Conversion:</Label>
          <Checkbox name="noteConversion" checked={organization.noteConversion} onChange={handleOrganizationInputChange} />
          <Label>Notes Convert to New Class:</Label>
          <Checkbox name="notesConvertToNewClass" checked={organization.notesConvertToNewClass} onChange={handleOrganizationInputChange} />
          <Label>Expand Option Pool:</Label>
          <Checkbox name="expandOptionPool" checked={organization.expandOptionPool} onChange={handleOrganizationInputChange} />
        </div>

        <div>Convertible Notes</div>
        {organization.notesFields.map((note, index) => (
          <div key={index}>
            <Table.HeadCell colSpan={2}>Note {index + 1}</Table.HeadCell>
            <Label>Principal Invested:</Label>
            <TextInput type="number" name={`notesFields[${index}].principalInvested`} value={note.principalInvested} onChange={handleNoteFieldsInputChange} />
            <Label>Conversion Discount:</Label>
            <TextInput type="number" name={`notesFields[${index}].conversionDiscount`} value={note.conversionDiscount} onChange={handleNoteFieldsInputChange} />
            <Label>Converstion Cap:</Label>
            <TextInput type="number" name={`notesFields[${index}].conversionCap`} value={note.conversionCap} onChange={handleNoteFieldsInputChange} />
            <Label>Conversion Date:</Label>
            <TextInput type="date" name={`notesFields[${index}].conversionDate`} value={inputDateFormat(note.conversionDate)} onChange={handleNoteFieldsInputChange} />
            <Label>Interest Rate:</Label>
            <TextInput type="number" name={`notesFields[${index}].interestRate`} value={note.interestRate} onChange={handleNoteFieldsInputChange} />
            <Label>Interest Start Date:</Label>
            <TextInput type="date" name={`notesFields[${index}].interestStartDate`} value={inputDateFormat(note.interestStartDate)} onChange={handleNoteFieldsInputChange} />
            <Button onClick={() => removeNoteField(index)}><TbTrash className="mr-2 h-5 w-5" /></Button>
          </div>
        ))}
        <div>New Note</div>
        <Label>Principal Invested:</Label>
        <TextInput type="number" name="principalInvested" value={noteFields.principalInvested} onChange={handleNoteFieldsInputChange} />
        <Label>Conversion Discount:</Label>
        <TextInput type="number" name="conversionDiscount" value={noteFields.conversionDiscount} onChange={handleNoteFieldsInputChange} />
        <Label>Conversion Cap:</Label>
        <TextInput type="number" name="conversionCap" value={noteFields.conversionCap} onChange={handleNoteFieldsInputChange} />
        <Label>Conversion Date:</Label>
        <TextInput type="date" name="conversionDate" value={inputDateFormat(noteFields.conversionDate)} onChange={handleNoteFieldsInputChange} />
        <Label>Interest Rate:</Label>
        <TextInput type="number" name="interestRate" value={noteFields.interestRate} onChange={handleNoteFieldsInputChange} />
        <Label>Interest Start Date:</Label>
        <TextInput type="date" name="interestStarTable.Cellate" value={inputDateFormat(noteFields.interestStartDate)} onChange={handleNoteFieldsInputChange} />
        <Button onClick={addNoteField}><TbRowInsertBottom className='mr-2 h-5 w-5' />Add</Button>
        <Button onClick={handleSubmit}><TbTable className='mr-2 h-5 w-5' />Generate Cap Table</Button>
      </form>
    {capTable && (
      <div>
        <h1 className="text-3xl font-bold underline">Pro Forma Cap Table</h1>
        <dl>
          <dt>Pre-Money Share Price</dt>
          <dd>${capTable.preMoneySharePrice()}</dd>
          <dt>Share Price for Financing</dt>
          <dd>${capTable.sharePriceForFinancing()}</dd>
        </dl>

        <Table>
          <thead>
            <Table.Row>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell colSpan={3} style={{borderRight: '1px solid black'}}>Pre-Money</Table.HeadCell>
              <Table.HeadCell colSpan={6}>Post-Money</Table.HeadCell>
            </Table.Row>
            <Table.Row>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell>Shares</Table.HeadCell>
              <Table.HeadCell>Ownership</Table.HeadCell>
              <Table.HeadCell style={{borderRight: '1px solid black'}}>Ownership Value</Table.HeadCell>
              <Table.HeadCell>Shares</Table.HeadCell>
              <Table.HeadCell>Ownership</Table.HeadCell>
              <Table.HeadCell>% Change</Table.HeadCell>
              <Table.HeadCell>Ownership Value</Table.HeadCell>
              <Table.HeadCell>Value Change</Table.HeadCell>
              <Table.HeadCell>Dilution</Table.HeadCell>
            </Table.Row>
          </thead>
          <Table.Body>
            {capTable.shareClasses().map((sc, index) => (
              <Table.Row>
                <Table.Cell>{sc.name}</Table.Cell>
                <Table.Cell>{asShares(sc.preMoneyShares)}</Table.Cell>
                <Table.Cell>{asPercent(sc.preMoneyPercentOwnership(capTable.totalPreMoneyShares()))}%</Table.Cell>
                <Table.Cell>${asUSD(sc.preMoneyOwnershipValue(capTable.preMoneySharePrice()))}</Table.Cell>
                <Table.Cell>{asShares(sc.postMoneyShares)}</Table.Cell>
                <Table.Cell>{asPercent(sc.postMoneyPercentOwnership(capTable.totalPostMoneyShares()))}%</Table.Cell>
                <Table.Cell>{asPercent(sc.postMoneyPercentChange(capTable.totalPostMoneyShares(), capTable.totalPreMoneyShares()))}%</Table.Cell>
                <Table.Cell>${asUSD(sc.postMoneyOwnershipValue(capTable.sharePriceForFinancing()))}</Table.Cell>
                <Table.Cell>${asUSD(sc.postMoneyValueChange(capTable.sharePriceForFinancing(),capTable.preMoneySharePrice()))}</Table.Cell>
                <Table.Cell>{asPercent(sc.postMoneyDilution(capTable.totalPostMoneyShares(), capTable.totalPreMoneyShares()))}%</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <tfoot>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>{asShares(capTable.totalPreMoneyShares())}</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>${asUSD(capTable.totalPreMoneyOwnershipValue())}</Table.Cell>
              <Table.Cell>{asShares(capTable.totalPostMoneyShares())}</Table.Cell>
              <Table.Cell>{asPercent(capTable.totalPostMoneyPercentOwnership())}%</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>${asUSD(capTable.totalPostMoneyOwnershipValue())}</Table.Cell>
              <Table.Cell>${asUSD(capTable.totalPostMoneyValueChange())}</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          </tfoot>
        </Table>
      </div>
    )}
    </div>
  );
};

export default App;
