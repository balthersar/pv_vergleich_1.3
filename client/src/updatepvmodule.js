import React, { Component } from 'react';
import styled from  'styled-components';
import {ButtonContainer} from './Button';
import {Link} from 'react-router-dom';

export default class UpdatePVModule extends Component {
    render() {
        
        return (
            <div>Hello from UpdatePVModule</div>
        )
    }
}

const ModalContainer = styled.div`
position:fixed;
top:0;
left:0;
right:0;
bottom:0;
font:1rem;
background:rgba(0,0,0,0.3);
display:flex;
align-items:center;
justify-content:center;
#modal {
    background:var(--mainWhite);
}
.abortButton{
    position: absolute; 
    right:0;
    
    font-size: 2rem;
    border: 0px solid #000000; 
    outline:none; 
    background:none;
    top:-1rem;
}
`;