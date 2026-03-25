import { ItemListPage } from "../list";
import { ItemCreateModal } from "../list/create-modal";

export const ItemCreatePage = () => {
  return (
    <ItemListPage>
      <ItemCreateModal />
    </ItemListPage>
  );
};
