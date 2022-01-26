pragma solidity ^0.8.11;

contract Lottery {
    
    address public manager;
    
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value == .01 ether, "Minimum value to enter is 10000000 gwei");
        players.push(msg.sender);
    }
    
    function pickWinner() public payable {
        require(msg.sender == manager, "Only manager address can pick a winner");

        uint index = (random() % players.length);
        address payable self = payable(address(this));
        address payable winner = payable(players[index]);
        winner.transfer(self.balance);

        players = new address[](0);
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
}