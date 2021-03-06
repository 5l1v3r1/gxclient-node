/**
 * @module GXClientFactory
 */
import GXClient from "./GXClient";

let ins = null;

function formatNetwork(network = "") {
    return network.replace("https://", "wss://").replace("http://", "ws://");
}

function needNewIns(oldIns, {keyProvider, account, network = "", signatureProvider}) {
    if (account != oldIns.account_id_or_name || (formatNetwork(network) != oldIns.witness)) {
        return true;
    } else {
        return false;
    }
}

function createNewIns({keyProvider, account, network = "", signatureProvider}) {
    return new GXClient(keyProvider, account, formatNetwork(network), signatureProvider);
}

function resetInsProperty(oldIns, {keyProvider, signatureProvider}) {
    oldIns.private_key = keyProvider;
    oldIns.signProvider = signatureProvider;
}

/**
 * A singleton factory for GXClient
 */
export default {
    constructor() {
        throw new Error("Usage: GXClientFactory.instance({keyProvider, account, network, signatureProvider})");
    },

    /**
     * get GXClient instance
     * @param keyProvider {String} - private key
     * @param account {String} - '1.2.12'|'gxcaccount'
     * @param network {String} - entry point network address
     * @param signatureProvider {signatureProvider} 
     * @returns {GXClient}
     */
    instance({keyProvider, account, network = "", signatureProvider}) {
        if (!!ins) {
            if (needNewIns(ins, {keyProvider, account, network, signatureProvider})) {
                ins = createNewIns({keyProvider, account, network, signatureProvider});
            } else {
                resetInsProperty(ins, {keyProvider, signatureProvider});
            }
        } else {
            ins = createNewIns({keyProvider, account, network, signatureProvider});
        }

        return ins;
    }
};

/**
 * This callback is displayed as a global member.
 * @callback signatureProvider
 * @param transaction {TransactionBuilder}
 * @param chain_id {String} - Chain Id
 */
