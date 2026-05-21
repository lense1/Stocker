import styled from "styled-components";

export const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-page);
`;

export const Content = styled.main`
  flex: 1;
  min-height: calc(100vh - 160px);
`;
