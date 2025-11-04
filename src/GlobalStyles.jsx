import styled, {createGlobalStyle} from 'styled-components';

export const GlobalStyles = createGlobalStyle`
*{
    padding:0;
    margin:0; 
    box-sizing:border-box;
    font-size:16px;
    font-family:sans-serif;
    list-style: none;
   }`


export const Wrapper = styled.div`
    padding: 1em;
    max-width:1140px;
    margin:0 auto;
`;

