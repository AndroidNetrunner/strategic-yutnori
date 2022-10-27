import styled from "styled-components";

const StyledButton = styled.button`
    margin: 1rem;
    display: flex;
`;

export default function Button({type, className, ableCondition, text, onClick}) {
    return <StyledButton type={type} className={className} disabled={!ableCondition} onClick={onClick}>
        <a>{text}</a>
        </StyledButton>
}
