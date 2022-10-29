import styled from "styled-components";

export default function Map() {
    return (
      <StyledTable>
        <tr>
          <td>
            <BigCircle />
          </td>
          <td colSpan={5}>
            <HorizontalCircle />
            <HorizontalCircle />
            <HorizontalCircle />
            <HorizontalCircle />
          </td>
          <td>
            <BigCircle />
          </td>
        </tr>
        <tr>
          <td rowSpan={5}>
            <VerticalCircle />
            <VerticalCircle />
            <VerticalCircle />
            <VerticalCircle />
          </td>
          <td>
            <SmallCircle />
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <SmallCircle />
          </td>
          <td rowSpan={5}>
            <VerticalCircle />
            <VerticalCircle />
            <VerticalCircle />
            <VerticalCircle />
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <SmallCircle />
          </td>
          <td></td>
          <td>
            <SmallCircle />
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td>
            <BigCircle />
          </td>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td>
            <SmallCircle />
          </td>
          <td></td>
          <td>
            <SmallCircle />
          </td>
        </tr>
        <tr>
          <td>
            <SmallCircle />
          </td>
          <td></td>
          <td></td>
          <td></td>
          <td>
            <SmallCircle />
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <BigCircle />
          </td>
          <td colSpan={5}>
            <HorizontalCircle />
            <HorizontalCircle />
            <HorizontalCircle />
            <HorizontalCircle />
          </td>
          <td>
            <BigCircle>
            </BigCircle>
          </td>
        </tr>
      </StyledTable>
    );
  }


const StyledTable = styled.table`
border-collapse: separate;
empty-cells: show;
`;

const BigCircle = styled.div`
width: 4.5rem;
height: 4.5rem;
border: 1px solid;
border-radius: 100%;
margin: 0 0.5rem 0 0.5rem;
`;

const SmallCircle = styled.div`
width: 1.5rem;
height: 1.5rem;
border: 1px solid;
border-radius: 100%;
margin: 2rem;
display: inline-block;
`;

const HorizontalCircle = styled(SmallCircle)`
margin-left: 3.2rem;
margin-right: 3.2rem;
`;
const VerticalCircle = styled(SmallCircle)`
margin-top: 5rem;
margin-bottom: 5rem;
display: block;
`;

const Piece = styled(BigCircle)`
background-color: ${(props) => props.color};
`;
