import { Col, Row } from "antd";

import { ItemContactsTable } from "./items-table";
import { ItemForm } from "./form";

export const ItemEditPage = () => {
  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <ItemForm />
        </Col>
        <Col xs={24} xl={12}>
          <ItemContactsTable />
        </Col>
      </Row>
    </div>
  );
};
