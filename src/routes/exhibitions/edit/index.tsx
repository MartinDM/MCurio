import { Col, Row } from "antd";

import { ExhibitionItemsTable } from "./items-table";
import { ExhibitionForm } from "./form";

export const ExhibitionEditPage = () => {
  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} xl={12}>
          <ExhibitionForm />
        </Col>
        <Col xs={24} xl={12}>
          <ExhibitionItemsTable />
        </Col>
      </Row>
    </div>
  );
};
