import { ExhibitionsListPage } from "../list";
import { ExhibitionsCreateModal } from "../list/create-modal";

export const ExhibitionCreatePage = () => {
  return (
    <ExhibitionsListPage>
      <ExhibitionsCreateModal />
    </ExhibitionsListPage>
  );
};
