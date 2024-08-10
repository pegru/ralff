import styled from 'styled-components';

export const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 4fr 4fr 8fr 1fr;
  column-gap: 10px;
`;

export const GridItem = styled.p`
  justify-self: start;
  align-self: center;
  margin: 3px;
  font: var(--font-text2-normal)
`;

export const GridItem1 = styled.div`
  display: flex;
  justify-self: end;
  margin: 3px;
  font: var(--font-text2-normal)
`;

export const Divider = styled.hr`
  border-top: 1px solid #727272;
  width: 100%;
`

// export const FormLayout = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-self: center;
//   width: 40%;
//   gap: 10px;
//   align-self: center;
//   border-style: solid;
//   border-width: 1px;
//   border-radius: 20px;
//   padding: 20px
// `;