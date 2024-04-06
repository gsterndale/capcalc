import React from "react";
import { Table } from "flowbite-react";
import { CapTable } from "@capcalc/calc";
import { prettyPercent, prettyShares, prettyUSD } from "@capcalc/utils";

type AppProps = {
  capTable: CapTable;
};
const ProFormaCapTable: React.FC<AppProps> = (props: AppProps) => {
  const omitInfinity = (value: string) => {
    if (value.includes("∞")) return "";
    return value;
  };
  return (
    <Table hoverable className="font-mono" id="proFormaCapTable">
      <Table.Head className="text-center">
        <Table.HeadCell className="text-left text-base">
          <p>{props.capTable.organization.name}</p>
          <p>{props.capTable.organization.newShareClass}</p>
        </Table.HeadCell>
        <Table.HeadCell colSpan={3} className="text-base">
          Pre-Money
        </Table.HeadCell>
        <Table.HeadCell colSpan={6} className="border-l text-base">
          Post-Money
        </Table.HeadCell>
      </Table.Head>
      <Table.Head className="text-center">
        <Table.HeadCell className="text-left">
          {props.capTable.organization.description}
        </Table.HeadCell>
        <Table.HeadCell colSpan={3} className="">
          {prettyUSD(props.capTable.preMoneySharePrice(), 2)}/share
        </Table.HeadCell>
        <Table.HeadCell colSpan={6} className="border-l">
          {prettyUSD(props.capTable.sharePriceForFinancing(), 2)}/share
        </Table.HeadCell>
      </Table.Head>
      <Table.Head className="text-right">
        <Table.HeadCell className="text-left">
          <p>{prettyUSD(props.capTable.organization.newMoneyRaised)}</p>
          <p>@ {prettyUSD(props.capTable.organization.preMoneyValuation)}</p>
          <p>
            {prettyPercent(
              props.capTable.organization.postMoneyOptionPoolSize,
              0
            )}
            ESOP
          </p>
        </Table.HeadCell>
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
      <Table.Body className="text-right">
        {props.capTable.shareClasses().map((shareClass, index) => (
          <Table.Row key={index}>
            <Table.Cell className="text-left">{shareClass.name}</Table.Cell>
            <Table.Cell>{prettyShares(shareClass.preMoneyShares)}</Table.Cell>
            <Table.Cell>
              {prettyPercent(
                shareClass.preMoneyPercentOwnership(
                  props.capTable.totalPreMoneyShares()
                )
              )}
            </Table.Cell>
            <Table.Cell>
              {prettyUSD(
                shareClass.preMoneyOwnershipValue(
                  props.capTable.preMoneySharePrice()
                )
              )}
            </Table.Cell>
            <Table.Cell className="border-l">
              {prettyShares(shareClass.postMoneyShares)}
            </Table.Cell>
            <Table.Cell>
              {prettyPercent(
                shareClass.postMoneyPercentOwnership(
                  props.capTable.totalPostMoneyShares()
                )
              )}
            </Table.Cell>
            <Table.Cell>
              {prettyPercent(
                shareClass.postMoneyPercentChange(
                  props.capTable.totalPostMoneyShares(),
                  props.capTable.totalPreMoneyShares()
                )
              )}
            </Table.Cell>
            <Table.Cell>
              {prettyUSD(
                shareClass.postMoneyOwnershipValue(
                  props.capTable.sharePriceForFinancing()
                )
              )}
            </Table.Cell>
            <Table.Cell>
              {prettyUSD(
                shareClass.postMoneyValueChange(
                  props.capTable.sharePriceForFinancing(),
                  props.capTable.preMoneySharePrice()
                )
              )}
            </Table.Cell>
            <Table.Cell>
              {omitInfinity(
                prettyPercent(
                  shareClass.postMoneyDilution(
                    props.capTable.totalPostMoneyShares(),
                    props.capTable.totalPreMoneyShares()
                  )
                )
              )}
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
      <Table.Body className="text-right border-t">
        <Table.Row>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            {prettyShares(props.capTable.totalPreMoneyShares())}
          </Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            {prettyUSD(props.capTable.totalPreMoneyOwnershipValue())}
          </Table.Cell>
          <Table.Cell className="border-l">
            {prettyShares(props.capTable.totalPostMoneyShares())}
          </Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            {prettyUSD(props.capTable.totalPostMoneyOwnershipValue())}
          </Table.Cell>
          <Table.Cell>
            {prettyUSD(props.capTable.totalPostMoneyValueChange())}
          </Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default ProFormaCapTable;
