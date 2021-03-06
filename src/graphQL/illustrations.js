import gql from 'graphql-tag'

export const GET_LISTE_ILLU_FILTRE_ESPACE = gql`
query listeIllustrationFiltered($espace: EspaceBF!, $typeIllu: TypeIllustration!) {
  allActivitesIllustrations(filter: {espace: $espace, typeIllu: $ typeIllu}) {
    id
    idImage
    format
  }
}
`

export const ADD_LISTE_ILLU = gql`
mutation addIllu($idImage: String! , $format: String!, $espace: EspaceBF!, $typeIllu: TypeIllustration!) {
  createActivitesIllustration(idImage: $idImage, format: $format, espace: $espace, typeIllu: $typeIllu) {
    id
    idImage
    format
    typeIllu
  }
}
`

export const DELETE_ILLU_GRAPHQL = gql`
mutation effaceIllu($id: ID!) {
  deleteActivitesIllustration (id: $id) {
    id
  }
}
`

export const DELETE_ILLU = gql`
query effaceImage($imageId: String!){effaceImage(imageId: $imageId) {
  message
}}
`

export const GET_ILLU_BY_ID = gql`
query illuById($id: ID!) {
  allActivitesIllustrations(filter: {id: $id}) {
    idImage
    format
  }
}
`
