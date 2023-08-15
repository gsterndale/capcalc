import React, { useState } from "react";
import { TextInput, Label, Table } from "flowbite-react";
import { Organization } from "@capcalc/calc";
import { prettyPercent, roundTo } from "@capcalc/utils";
import parseFloatInLocale from "../common/parseFloatInLocale";

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

const ShareClassList: React.FC<AppProps> = (props: AppProps) => {
  const initialSum =
    props.organization.foundersNumberOfShares +
    props.organization.commonNumberOfShares +
    props.organization.warrantsNumberOfShares +
    props.organization.grantedOptionsNumberOfShares +
    props.organization.oldOptionsNumberOfShares;
  const inititalShareClassRows: ShareClassRow[] = [
    {
      label: "Founders' Shares",
      key: "founders",
      shares: props.organization.foundersNumberOfShares,
      percent: props.organization.foundersNumberOfShares / initialSum,
    },
    {
      label: "Rest of Common",
      key: "common",
      shares: props.organization.commonNumberOfShares,
      percent: props.organization.commonNumberOfShares / initialSum,
    },
    {
      label: "Warrants",
      key: "warrants",
      shares: props.organization.warrantsNumberOfShares,
      percent: props.organization.warrantsNumberOfShares / initialSum,
    },
    {
      label: "Granted Options",
      key: "grantedOptions",
      shares: props.organization.grantedOptionsNumberOfShares,
      percent: props.organization.grantedOptionsNumberOfShares / initialSum,
    },
    {
      label: "Options Available Before",
      key: "oldOptions",
      shares: props.organization.oldOptionsNumberOfShares,
      percent: props.organization.oldOptionsNumberOfShares / initialSum,
    },
  ];
  const [shareClassRows, setShareClassRows] = useState<Array<ShareClassRow>>(
    inititalShareClassRows
  );

  const handleShareClassInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value, type, checked } = event.target;
    const inputValue = parseFloatInLocale(value) || 0;

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
    <form>
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
            {shareClassRows.map((shareClassRow, index) => (
              <Table.Row key={index}>
                <Table.Cell className="py-1 px-4 text-left">
                  <Label>{shareClassRow.label}:</Label>
                </Table.Cell>
                <Table.Cell className="py-1 px-4">
                  <TextInput
                    type="text"
                    sizing="sm"
                    name={shareClassRow.key}
                    value={shareClassRow.shares.toLocaleString()}
                    onChange={handleShareClassInputChange}
                  />
                </Table.Cell>
                <Table.Cell>{prettyPercent(shareClassRow.percent)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </fieldset>
    </form>
  );
};

export default ShareClassList;
