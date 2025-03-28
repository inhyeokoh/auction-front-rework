import React from "react";
import { Mic, MicOff } from 'lucide-react';

export const ToggleAudioButton = React.memo(({ isAudioMuted, onClick }) => {

    return (
        <button onClick={onClick} style={{ display: "flex", alignItems: "center" }}>
            {isAudioMuted ? (
                <>
                    <MicOff size={24} color="red" />
                </>
            ) : (
                <>
                    <Mic size={24} color="green" />
                </>
            )}
        </button>
    );
});