import Control, { ControlProps } from '../Control';

type item = {
  value: string;
  label?: string;
  isDisabled?: boolean;
};

type ItemProps = ControlProps & {
  item: item;
  selected: boolean;
  name?: string;
  type?: string;
  className?: string;
  onClick?: (item: item) => void; 
};

class Item extends Control {
  protected _props: ItemProps = {
    ...this._props,
    ...{
      type: 'default'
    }
  };
  private inputEl: HTMLInputElement;
  public isSelected: boolean = false;
  public item: item;

  constructor(params: ItemProps) {
    super();
    if (
      typeof params === 'object' &&
      params !== null &&
      typeof params.isDisabled !== 'boolean'
    ) {
      delete params.isDisabled;
    }
    if (params) {
      this._props = { ...this._props, ...params };
    }

    const className = [
      'kuc-list-item',
      this._props.selected ? 'kuc-list-item-selected' : '',
      this._props.isDisabled ? 'kuc-list-item-disable' : ''
    ];
    this.element = document.createElement('div');
    this.element.className = className.join(' ').trim();
    const iconEl = document.createElement('span');
    iconEl.className = 'kuc-icon-check';
    const iEl = document.createElement('i');
    iEl.className = 'fa fa-check';
    iEl.setAttribute('aria-hidden', 'true');
    iconEl.appendChild(iEl);
    const labelEl = document.createElement('span');
    labelEl.className = 'kuc-list-item-label';
    labelEl.innerText = this._props.item.label;
    this.element.appendChild(iconEl);
    this.element.appendChild(labelEl);
    this.on('click',(e) => {
      this._props.onClick(this._props.item);
    });
  }

  rerender(changedAttr?: string[]) {
    super.rerender();
    if (this._props.isDisabled) {
      this.inputEl.setAttribute('disabled', `${this._props.isDisabled}`);
    } else {
      this.inputEl.removeAttribute('disabled');
    }
    if (!changedAttr) return;
  }
}

export default Item;
