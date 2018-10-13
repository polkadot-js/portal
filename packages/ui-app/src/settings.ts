// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import store from 'store';

export interface SettingsStruct {
  apiUrl: string;
  chainId: number;
  i18nLang: string;
  uiMode: string;
  uiTheme: string;
}

class Settings implements SettingsStruct {
  private _apiUrl: string;
  private _chainId: number;
  private _i18nLang: string;
  private _uiMode: string;
  private _uiTheme: string;

  constructor () {
    const settings = store.get('settings') || {};

    // FIXME Here we have the defaults for BBQ, swap to Polkadot as soon as poc-3 is there
    // FIXME WS_URL first, then substrate-rpc
    this._apiUrl = settings.apiUrl || 'wss://substrate-rpc.parity.io/' || process.env.WS_URL;
    this._chainId = settings.chainId || 68;
    this._i18nLang = settings.i18nLang || 'default';
    this._uiMode = settings.uiMode || process.env.UI_MODE || 'full';
    this._uiTheme = settings.uiTheme || process.env.UI_THEME || 'substrate';
  }

  get apiUrl (): string {
    return this._apiUrl;
  }

  get chainId (): number {
    return this._chainId;
  }

  get i18nLang (): string {
    return this._i18nLang;
  }

  get uiMode (): string {
    return this._uiMode;
  }

  get uiTheme (): string {
    return this._uiTheme;
  }

  availableChains (): Array<{ id: number, desc: string, url: string }> {
    return [
      { id: 0, desc: 'Local Node', url: 'ws://127.0.0.1:9944/' },
      { id: 68, desc: 'BBQ Birch', url: 'wss://substrate-rpc.parity.io/' }
    ];
  }

  availableLanguages (): Array<{ id: string, desc: string }> {
    return [
      { id: 'default', desc: 'Default browser language (auto-detect)' }
    ];
  }

  availableUIModes (): Array<{ id: string, desc: string }> {
    return [
      { id: 'full', desc: 'Fully featured' },
      { id: 'light', desc: 'Basic features only' }
    ];
  }

  availableUIThemes (): Array<{ id: string, desc: string }> {
    return [
      { id: 'substrate', desc: 'Substrate' },
      { id: 'polkadot', desc: 'Polkadot' }
    ];
  }

  get (): SettingsStruct {
    return {
      apiUrl: this._apiUrl,
      chainId: this._chainId,
      i18nLang: this._i18nLang,
      uiMode: this._uiMode,
      uiTheme: this._uiTheme
    };
  }

  set (settings: Partial<SettingsStruct>): void {
    this._apiUrl = settings.apiUrl || this._apiUrl;
    this._chainId = settings.chainId || this._chainId;
    this._i18nLang = settings.i18nLang || this._i18nLang;
    this._uiMode = settings.uiMode || this._uiMode;
    this._uiTheme = settings.uiTheme || this._uiTheme;

    store.set('settings', this.get());
  }
}

const settings = new Settings();

export default settings;
