import React, { useReducer, useState } from 'react';

const pileSize = 25;
const minTake = 1;
const maxTake = 3;

const initialState = {
    pile: pileSize,
    playerMatches: 0,
    aiMatches: 0,
    turn: 'player',
    winner: null
};

function reducer(state, action) {
    switch (action.type) {
        case 'TAKE_MATCHES':
            const { n } = action.payload;
            if (n < minTake || n > maxTake || n > state.pile) {
                throw new Error('Invalid number of matches');
            }

            const updatedPile = state.pile - n;
            const updatedPlayerMatches = state.playerMatches + n;

            if (updatedPile === 0) {
                return {
                    ...state,
                    pile: updatedPile,
                    playerMatches: updatedPlayerMatches,
                    winner: 'player'
                };
            } else {
                return {
                    ...state,
                    pile: updatedPile,
                    playerMatches: updatedPlayerMatches,
                    turn: 'ai'
                };
            }
        case 'AI_TAKE_MATCHES':
            const { aiTake } = action.payload;
            const newPile = state.pile - aiTake;
            const newAiMatches = state.aiMatches + aiTake;

            if (newPile === 0) {
                return {
                    ...state,
                    pile: newPile,
                    aiMatches: newAiMatches,
                    winner: 'ai'
                };
            } else {
                return {
                    ...state,
                    pile: newPile,
                    aiMatches: newAiMatches,
                    turn: 'player'
                };
            }
        case 'RESET_GAME':
            return initialState;
        default:
            throw new Error('Invalid action type');
    }
}

const Game = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const checkWinner = () => {
        if (state.pile === 0) {
            if (state.playerMatches % 2 === 0) {
                dispatch({ type: 'SET_WINNER', payload: { winner: 'player' } });
            } else {
                dispatch({ type: 'SET_WINNER', payload: { winner: 'ai' } });
            }
        }
    };

    const takeMatches = async (n) => {
        dispatch({ type: 'TAKE_MATCHES', payload: { n } });
        await aiTurn();
    };

    const aiTurn = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        let aiTake = Math.floor(Math.random() * (maxTake - minTake + 1)) + minTake;
        if (aiTake > state.pile) {
            aiTake = state.pile;
        }

        dispatch({ type: 'AI_TAKE_MATCHES', payload: { aiTake } });

        // Check winner after AI's turn
        checkWinner();
    };

    const resetGame = () => {
        dispatch({ type: 'RESET_GAME' });
    };

    return (
        <div>
            <div>
                <h2>Matches: {state.pile}</h2>
                <div className="matches">
                    {[...Array(state.pile)].map((_, index) => (
                        <span key={index} role="img" aria-label="match">
              🔥
            </span>
                    ))}
                </div>
            </div>
            <div>
                <h2>Your Matches: {state.playerMatches}</h2>
                <div className="matches">
                    {[...Array(state.playerMatches)].map((_, index) => (
                        <span key={index} role="img" aria-label="match">
              🔥
            </span>
                    ))}
                </div>
            </div>
            <div>
                <h2>AI Matches: {state.aiMatches}</h2>
                <div className="matches">
                    {[...Array(state.aiMatches)].map((_, index) => (
                        <span key={index} role="img" aria-label="match">
              🔥
            </span>
                    ))}
                </div>
            </div>
            <div>
                {state.winner ? (
                    <h2>{state.winner === 'player' ? 'You win!' : 'AI wins!'}</h2>
                ) : (
                    <h2>{state.turn === 'player' ? 'Your turn' : "AI's turn"}</h2>
                )}
            </div>
            <div>
                {state.turn === 'player' &&
                    !state.winner &&
                    [...Array(maxTake)].map((_, index) => {
                        const takeAmount = index + 1;
                        return (
                            <button key={takeAmount} onClick={() => takeMatches(takeAmount)}>
                                Take {takeAmount} match{takeAmount > 1 ? 'es' : ''}
                            </button>
                        );
                    })}
                {state.winner && (
                    <button onClick={resetGame}>Start New Game</button>
                )}
            </div>
        </div>
    );
};

export default Game;
