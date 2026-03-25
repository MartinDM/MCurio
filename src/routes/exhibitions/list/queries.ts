import gql from "graphql-tag";

export const EXHIBITIONS_LIST_QUERY = gql`
  query ExhibitionsList(
    $filter: ExhibitionFilter!
    $sorting: [ExhibitionSort!]
    $paging: OffsetPaging!
  ) {
    exhibitions(filter: $filter, sorting: $sorting, paging: $paging) {
      totalCount
      nodes {
        id
        name
        avatarUrl
        dealsAggregate {
          sum {
            value
          }
        }
      }
    }
  }
`;

export const CREATE_EXHIBITION_MUTATION = gql`
  mutation CreateExhibition($input: CreateOneExhibitionInput!) {
    createOneExhibition(input: $input) {
      id
      salesOwner {
        id
      }
    }
  }
`;
