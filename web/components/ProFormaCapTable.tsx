import React from "react";
import { Table } from "flowbite-react";

const ProFormaCapTable: React.FC = () => {
  return (
    <Table hoverable>
      <Table.Head>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell colSpan={3}>Pre-Money $3.00/share</Table.HeadCell>
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
  );
};

export default ProFormaCapTable;
