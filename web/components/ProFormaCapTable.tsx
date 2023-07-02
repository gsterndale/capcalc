import React from "react";
import { Table } from "flowbite-react";

const ProFormaCapTable: React.FC = () => {
  return (
    <Table hoverable className="font-mono ">
      <Table.Head className="text-center">
        <Table.HeadCell className="text-left text-base">
          Scenario A
        </Table.HeadCell>
        <Table.HeadCell colSpan={3} className="text-base">
          Pre-Money
        </Table.HeadCell>
        <Table.HeadCell colSpan={6} className="border-l text-base">
          Post-Money
        </Table.HeadCell>
      </Table.Head>
      <Table.Head className="text-center">
        <Table.HeadCell className="text-left">Ideal</Table.HeadCell>
        <Table.HeadCell colSpan={3} className="">
          $3.00/share
        </Table.HeadCell>
        <Table.HeadCell colSpan={6} className="border-l">
          $2.18/share
        </Table.HeadCell>
      </Table.Head>
      <Table.Head className="text-right">
        <Table.HeadCell className="text-left">
          $10M @ $30M-PRE 20%ESOP
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
        <Table.Row>
          <Table.Cell className="text-left">Founders</Table.Cell>
          <Table.Cell>8,000,000</Table.Cell>
          <Table.Cell>80.0%</Table.Cell>
          <Table.Cell>$24,000,000</Table.Cell>
          <Table.Cell className="border-l">8,000,000</Table.Cell>
          <Table.Cell>57.4%</Table.Cell>
          <Table.Cell>-22.6%</Table.Cell>
          <Table.Cell>$18,000,000</Table.Cell>
          <Table.Cell>-$6,000,000</Table.Cell>
          <Table.Cell>-28.2%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Other Common</Table.Cell>
          <Table.Cell>1,000,000</Table.Cell>
          <Table.Cell>10.0%</Table.Cell>
          <Table.Cell>$3,000,000</Table.Cell>
          <Table.Cell className="border-l">1,000,000</Table.Cell>
          <Table.Cell>7.2%</Table.Cell>
          <Table.Cell>-2.8%</Table.Cell>
          <Table.Cell>$2,200,000</Table.Cell>
          <Table.Cell>-$78,000</Table.Cell>
          <Table.Cell>-28.2%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Warrants</Table.Cell>
          <Table.Cell>100,000</Table.Cell>
          <Table.Cell>1.0%</Table.Cell>
          <Table.Cell>$300,000</Table.Cell>
          <Table.Cell className="border-l">100,000</Table.Cell>
          <Table.Cell>0.7%</Table.Cell>
          <Table.Cell>-0.3%</Table.Cell>
          <Table.Cell>$222,000</Table.Cell>
          <Table.Cell>-$78,000</Table.Cell>
          <Table.Cell>-28.2%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Notes</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell className="border-l">1,000,000</Table.Cell>
          <Table.Cell>7.2%</Table.Cell>
          <Table.Cell>7.2%</Table.Cell>
          <Table.Cell>$2,200,000</Table.Cell>
          <Table.Cell>$2,200,000</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">New Money</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell className="border-l">449,000</Table.Cell>
          <Table.Cell>3.2%</Table.Cell>
          <Table.Cell>3.2%</Table.Cell>
          <Table.Cell>$1,000,000</Table.Cell>
          <Table.Cell>$1,000,000</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Grants</Table.Cell>
          <Table.Cell>800,000</Table.Cell>
          <Table.Cell>8.0%</Table.Cell>
          <Table.Cell>$2,400,000</Table.Cell>
          <Table.Cell className="border-l">800,000</Table.Cell>
          <Table.Cell>5.7%</Table.Cell>
          <Table.Cell>-2.3%</Table.Cell>
          <Table.Cell>$1,800,000</Table.Cell>
          <Table.Cell>-$620,000</Table.Cell>
          <Table.Cell>-28.2%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">Old Pool</Table.Cell>
          <Table.Cell>100,000</Table.Cell>
          <Table.Cell>1.0%</Table.Cell>
          <Table.Cell>$300,000</Table.Cell>
          <Table.Cell className="border-l">100,000</Table.Cell>
          <Table.Cell>0.7%</Table.Cell>
          <Table.Cell>-0.3%</Table.Cell>
          <Table.Cell>$222,000</Table.Cell>
          <Table.Cell>-$78,000</Table.Cell>
          <Table.Cell>-28.2%</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell className="text-left">New Pool</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell>0</Table.Cell>
          <Table.Cell className="border-l">2,500,000</Table.Cell>
          <Table.Cell>17.8%</Table.Cell>
          <Table.Cell>17.8%</Table.Cell>
          <Table.Cell>$5,500,000</Table.Cell>
          <Table.Cell>$5,500,000</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </Table.Body>
      <tfoot className="text-right border-t">
        <Table.Row>
          <Table.Cell></Table.Cell>
          <Table.Cell>10,000,000</Table.Cell>
          <Table.Cell>100%</Table.Cell>
          <Table.Cell>$30,000,000</Table.Cell>
          <Table.Cell className="border-l">13,900,000</Table.Cell>
          <Table.Cell>100%</Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>$31,000,000</Table.Cell>
          <Table.Cell>$1,000,000</Table.Cell>
          <Table.Cell></Table.Cell>
        </Table.Row>
      </tfoot>
    </Table>
  );
};

export default ProFormaCapTable;
