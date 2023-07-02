import React, { useState } from "react";
import { TextInput, Label, Table } from "flowbite-react";
import { Organization } from "@capcalc/calc";
import { prettyPercent, roundTo } from "@capcalc/utils";

type AppProps = {
  organization: Organization;
  handler: Function;
};

type ShareClassRow = {
  label: string;
  key: string;
  shares: number;
  percent: number;
};

const inititalShareClassRows: ShareClassRow[] = [
  { label: "Founders", key: "founders", percent: 0, shares: 0 },
  { label: "Other Common", key: "common", percent: 0, shares: 0 },
  { label: "Warrants", key: "warrants", percent: 0, shares: 0 },
  { label: "Granted Options", key: "grantedOptions", percent: 0, shares: 0 },
  { label: "Old Options", key: "oldOptions", percent: 0, shares: 0 },
];

const ShareClassList: React.FC<AppProps> = (props: AppProps) => {
  const [shareClassRows, setShareClassRows] = useState<Array<ShareClassRow>>(
    inititalShareClassRows
  );

  const handleShareClassInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseFloat(value);

    props.handler({ key: name, shares: inputValue });

    setShareClassRows((prevState) => {
      let rows = shareClassRows.map((row) => {
        if (row.key === name) {
          return { ...row, shares: inputValue };
        } else {
          return row;
        }
      });
      const sum = rows.reduce((memo, row) => memo + row.shares, 0);
      rows.map((row) => {
        row.percent = sum > 0 ? row.shares / sum : 0;
      });
      return rows;
    });
  };

  return (
    <div>
      <fieldset>
        <Table className="text-right">
          <Table.Head>
            <Table.HeadCell className="py-1 px-4 text-left">
              Share Class
            </Table.HeadCell>
            <Table.HeadCell className="py-1 px-4 text-left">
              Shares
            </Table.HeadCell>
            <Table.HeadCell className="py-1 px-4">Ownership</Table.HeadCell>
          </Table.Head>
          <Table.Body className="text-right">
            {shareClassRows.map((shareClassRow) => (
              <Table.Row>
                <Table.Cell className="py-1 px-4 text-left">
                  <Label>{shareClassRow.label}:</Label>
                </Table.Cell>
                <Table.Cell className="py-1 px-4">
                  <TextInput
                    type="number"
                    sizing="sm"
                    min={0}
                    name={shareClassRow.key}
                    value={shareClassRow.shares}
                    onChange={handleShareClassInputChange}
                  />
                </Table.Cell>
                <Table.Cell>{prettyPercent(shareClassRow.percent)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </fieldset>
    </div>
  );
};

export default ShareClassList;
