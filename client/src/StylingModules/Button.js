import styling from 'styled-components'

export const ButtonContainer = styling.button`
    text-transform: capitalize;
    font-size: 1.0rem;
    background:transparent;
    border: 0.1rem solid var(--wombatGreen);
    background:${props => (props.cart?"var(--mainYellow)":"var(--wombatGreen)")};
    color: ${props => (props.cart?"var(--mainWhite)":"var(--mainWhite)")};
    border-radius: 0.5rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    margin: 0.2rem 0.5rem 0.2rem 0;
    transition all 0.5s ease-in-ou;
    &:hover{
        background:${props => (props.cart?"var(--mainWhite)":"var(--mainWhite)")};
        border-color:${props => (props.cart?"var(--mainWhite)":"var(--mainWhite)")};
        color: var(--wombatGreen);
    }
    &:focus{
        outline: none;
    }
`;