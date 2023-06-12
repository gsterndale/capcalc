import React, { useState, FormEvent } from 'react';
import { CapTable, Organization, NoteFields } from '@capcalc/calc';
import { asShares, asUSD, asPercent } from '@capcalc/utils';

const initialOrganizationState: Organization = {
  newShareClass: '',
  preMoneyValuation: 0,
  newMoneyRaised: 0,
  noteConversion: false,
  notesConvertToNewClass: false,
  expandOptionPool: false,
  postMoneyOptionPoolSize: 0,
  notesFields: [],
  foundersNumberOfShares: 0,
  commonNumberOfShares: 0,
  warrantsNumberOfShares: 0,
  grantedOptionsNumberOfShares: 0,
  oldOptionsNumberOfShares: 0,
};

const initialNoteFieldsState: NoteFields = {
  principalInvested: 0,
  conversionDiscount: 0,
  conversionDate: undefined,
  interestRate: undefined,
  interestStartDate: undefined,
  conversionCap: undefined,
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
    // console.log(JSON.stringify(organization))
    // console.log({organization: organization, shareClasses: newCapTable.shareClasses(), preMoneySharePrice: newCapTable.preMoneySharePrice(), spff: newCapTable.sharePriceForFinancing()});
    setCapTable(newCapTable);
  };

  return (
    <div>
      <h1>Pro Forma Cap Table</h1>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                <h2>Organization</h2>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <label htmlFor="newShareClass"> New Share Class:</label>
              </td>
              <td>
                <input
                  type="text"
                  name="newShareClass"
                  value={organization.newShareClass}
                  onChange={handleOrganizationInputChange}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Pre-Money Valuation:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="preMoneyValuation"
                    value={organization.preMoneyValuation}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>New Money Raised:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="newMoneyRaised"
                    value={organization.newMoneyRaised}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Post-Money Option Pool Size:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="postMoneyOptionPoolSize"
                    value={organization.postMoneyOptionPoolSize}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Founders Number of Shares:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="foundersNumberOfShares"
                    value={organization.foundersNumberOfShares}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Common Number of Shares:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="commonNumberOfShares"
                    value={organization.commonNumberOfShares}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Warrants Number of Shares:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="warrantsNumberOfShares"
                    value={organization.warrantsNumberOfShares}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Granted Options Number of Shares:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="grantedOptionsNumberOfShares"
                    value={organization.grantedOptionsNumberOfShares}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Old Options Number of Shares:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="oldOptionsNumberOfShares"
                    value={organization.oldOptionsNumberOfShares}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Note Conversion:</label>
              </td>
              <td>
                  <input
                    type="checkbox"
                    name="noteConversion"
                    checked={organization.noteConversion}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Notes Convert to New Class:</label>
              </td>
              <td>
                  <input
                    type="checkbox"
                    name="notesConvertToNewClass"
                    checked={organization.notesConvertToNewClass}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Expand Option Pool:</label>
              </td>
              <td>
                  <input
                    type="checkbox"
                    name="expandOptionPool"
                    checked={organization.expandOptionPool}
                    onChange={handleOrganizationInputChange}
                  />
              </td>
            </tr>
          </tbody>
        </table>
        <table>
          <thead>
            <tr>
              <th colSpan={2}>
                <h2>Convertible Notes</h2>
              </th>
            </tr>
          </thead>
          {organization.notesFields.map((note, index) => (
            <tbody>
              <tr key={index}>
                <th colSpan={2}>Note {index + 1}</th>
              </tr>
              <tr>
                <td>
                  <label>Principal Invested:</label>
                </td>
                <td>
                    <input
                      type="number"
                      name={`notesFields[${index}].principalInvested`}
                      value={note.principalInvested}
                      onChange={handleNoteFieldsInputChange}
                    />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Conversion Discount:</label>
                </td>
                <td>
                    <input
                      type="number"
                      name={`notesFields[${index}].conversionDiscount`}
                      value={note.conversionDiscount}
                      onChange={handleNoteFieldsInputChange}
                    />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Converstion Cap:</label>
                </td>
                <td>
                    <input
                      type="number"
                      name={`notesFields[${index}].conversionCap`}
                      value={note.conversionCap}
                      onChange={handleNoteFieldsInputChange}
                    />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Conversion Date:</label>
                </td>
                <td>
                    <input
                      type="date"
                      name={`notesFields[${index}].conversionDate`}
                      value={inputDateFormat(note.conversionDate)}
                      onChange={handleNoteFieldsInputChange}
                    />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Interest Rate:</label>
                </td>
                <td>
                    <input
                      type="number"
                      name={`notesFields[${index}].interestRate`}
                      value={note.interestRate}
                      onChange={handleNoteFieldsInputChange}
                    />
                </td>
              </tr>
              <tr>
                <td>
                  <label>Interest Start Date:</label>
                </td>
                <td>
                    <input
                      type="date"
                      name={`notesFields[${index}].interestStartDate`}
                      value={inputDateFormat(note.interestStartDate)}
                      onChange={handleNoteFieldsInputChange}
                    />
                </td>
              </tr>
              <tr>
                <th colSpan={2}>
                      <button type="button" onClick={() => removeNoteField(index)}>
                        Remove Note Field
                      </button>
                </th>
              </tr>
            </tbody>
          ))}
          <tbody>
              <tr>
                <th colSpan={2}>New Note</th>
              </tr>
            <tr>
              <td>
                <label>Principal Invested:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="principalInvested"
                    value={noteFields.principalInvested}
                    onChange={handleNoteFieldsInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Conversion Discount:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="conversionDiscount"
                    value={noteFields.conversionDiscount}
                    onChange={handleNoteFieldsInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Conversion Cap:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="conversionCap"
                    value={noteFields.conversionCap}
                    onChange={handleNoteFieldsInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Conversion Date:</label>
              </td>
              <td>
                  <input
                    type="date"
                    name="conversionDate"
                    value={inputDateFormat(noteFields.conversionDate)}
                    onChange={handleNoteFieldsInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Interest Rate:</label>
              </td>
              <td>
                  <input
                    type="number"
                    name="interestRate"
                    value={noteFields.interestRate}
                    onChange={handleNoteFieldsInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <label>Interest Start Date:</label>
              </td>
              <td>
                  <input
                    type="date"
                    name="interestStartDate"
                    value={inputDateFormat(noteFields.interestStartDate)}
                    onChange={handleNoteFieldsInputChange}
                  />
              </td>
            </tr>
            <tr>
              <td>
                <button type="button" onClick={addNoteField}>+</button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th colSpan={2}>
                <button type="submit">Submit</button>
              </th>
            </tr>
          </tfoot>
        </table>
      </form>

      {capTable && (
        <div>
          <dl>
            <dt>Pre-Money Share Price</dt>
            <dd>{capTable.preMoneySharePrice()}</dd>
            <dt>Share Price for Financing</dt>
            <dd>{capTable.sharePriceForFinancing()}</dd>
          </dl>
          <table cellPadding={5} cellSpacing={0} style={{textAlign: "right"}}>
            <colgroup>
              <col span={1} />
              <col span={3} />
              <col span={6} />
            </colgroup>
            <thead style={{textAlign: "center"}}>
              <tr>
                <th></th>
                <th colSpan={3} style={{borderRight: '1px solid black'}}>Pre-Money</th>
                <th colSpan={6}>Post-Money</th>
              </tr>
              <tr>
                <th></th>
                <th>Shares</th>
                <th>Ownership</th>
                <th style={{borderRight: '1px solid black'}}>Ownership Value</th>
                <th>Shares</th>
                <th>Ownership</th>
                <th>% Change</th>
                <th>Ownership Value</th>
                <th>Value Change</th>
                <th>Dilution</th>
              </tr>
            </thead>
            <tbody>
              {capTable.shareClasses().map((sc, index) => (
                <tr>
                  <td>{sc.name}</td>
                  <td>{asShares(sc.preMoneyShares)}</td>
                  <td>{asPercent(sc.preMoneyPercentOwnership(capTable.totalPreMoneyShares()))}%</td>
                  <td style={{borderRight: '1px solid black'}}>${asUSD(sc.preMoneyOwnershipValue(capTable.preMoneySharePrice()))}</td>
                  <td>{asShares(sc.postMoneyShares)}</td>
                  <td>{asPercent(sc.postMoneyPercentOwnership(capTable.totalPostMoneyShares()))}%</td>
                  <td>{asPercent(sc.postMoneyPercentChange(capTable.totalPostMoneyShares(), capTable.totalPreMoneyShares()))}%</td>
                  <td>${asUSD(sc.postMoneyOwnershipValue(capTable.sharePriceForFinancing()))}</td>
                  <td>${asUSD(sc.postMoneyValueChange(capTable.sharePriceForFinancing(),capTable.preMoneySharePrice()))}</td>
                  <td>{asPercent(sc.postMoneyDilution(capTable.totalPostMoneyShares(), capTable.totalPreMoneyShares()))}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td>{asShares(capTable.totalPreMoneyShares())}</td>
                <td></td>
                <td style={{borderRight: '1px solid black'}}>${asUSD(capTable.totalPreMoneyOwnershipValue())}</td>
                <td>{asShares(capTable.totalPostMoneyShares())}</td>
                <td>{asPercent(capTable.totalPostMoneyPercentOwnership())}%</td>
                <td></td>
                <td>${asUSD(capTable.totalPostMoneyOwnershipValue())}</td>
                <td>${asUSD(capTable.totalPostMoneyValueChange())}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
