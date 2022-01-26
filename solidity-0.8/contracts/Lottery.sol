pragma solidity ^0.8.11;

contract Lottery {
    
    address public manager;
    
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        players.push(msg.sender);
    }
    
    function pickwinner() public {

    }
}