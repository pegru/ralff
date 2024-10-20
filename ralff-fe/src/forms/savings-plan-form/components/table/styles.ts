import styled from 'styled-components';

export const Grid = styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 4fr 4fr 8fr 1fr;
    column-gap: 10px;
`;

export const GridItem = styled.div`
    justify-self: start;
    margin: 12px 3px 3px 3px;
`;

export const GridItem1 = styled.div`
    display: flex;
    justify-self: end;
    align-content: center;
    margin: 3px;
`;

export const Divider = styled.hr`
    border-top: 1px solid #727272;
    width: 100%;
`