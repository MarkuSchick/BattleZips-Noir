
import { stringify } from "@iarna/toml";
import { BarretenbergWasm } from '@noir-lang/barretenberg/dest/wasm';
import { writeFileSync } from 'fs';
import { SinglePedersen } from '@noir-lang/barretenberg/dest/crypto/pedersen';
import { numToHex } from '../utils';


(async () => {
    const barretenberg = await BarretenbergWasm.new();
    const pedersen = new SinglePedersen(barretenberg);
    const ships = [
        0, 5, 0, // 50, 51, 52, 53, 54
        0, 6, 0, // 60, 61, 62, 63
        0, 7, 0, // 70, 71, 72
        0, 8, 0, // 80, 81, 82
        0, 9, 0 // 90, 91
    ];
    const shot = [1, 6];
    const shipBuffer = pedersen.compressInputs(ships.map(coord => (Buffer.from(numToHex(coord), 'hex'))));
    const hash = `0x${shipBuffer.toString('hex')}`
    const hit = 1;
    writeFileSync('circuits/shot/Prover.toml', stringify({ hash, hit, shot, ships }));
    console.log('Witness written to Prover.toml');
    writeFileSync('circuits/shot/Verifier.toml', stringify({
        setpub: [],
        hash,
        hit,
        shot
    }));
    console.log('Verifier written to Verifier.toml');
})();