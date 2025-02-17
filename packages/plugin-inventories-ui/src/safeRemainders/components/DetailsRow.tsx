import React from 'react';
import * as dayjs from 'dayjs';
import { ActionButtons, Button, FormControl, Tip } from '@erxes/ui/src';
import { ISafeRemainderItem } from '../types';
import { FinanceAmount } from '../../styles';

type Props = {
  item: ISafeRemainderItem;
  updateItem: (_id: string, remainder: number, status: string) => void;
  removeItem: (item: ISafeRemainderItem) => void;
};

type State = {
  status: string;
  remainder: number;
  diff: number;
};

class Row extends React.Component<Props, State> {
  private timer?: NodeJS.Timer;

  constructor(props) {
    super(props);

    this.state = {
      status: 'new',
      remainder: props.item.count,
      diff: props.item.count - props.item.preCount
    };
  }

  displayNumber = (value: number) => {
    return (value || 0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  update = () => {
    const { remainder, status } = this.state;
    const { updateItem, item } = this.props;

    updateItem(item._id, remainder, status);
  };

  remove = () => {
    const { removeItem, item } = this.props;

    removeItem(item);
  };

  onChangeCheck = (event: any) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    event.preventDefault();

    const checked = event.target.checked;
    this.setState({ status: checked ? 'checked' : 'new' });

    this.timer = setTimeout(() => {
      this.update();
    }, 100);
  };

  onChangeRemainder = (event: any) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    event.preventDefault();
    const value = Number(event.target.value);
    this.setState({
      remainder: value,
      diff: value - this.props.item.preCount,
      status: 'checked'
    });

    this.timer = setTimeout(() => {
      this.update();
    }, 500);
  };

  onChangeDiff = (event: any) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    event.preventDefault();
    const value = Number(event.target.value);
    this.setState({
      diff: value,
      remainder: value + this.props.item.preCount,
      status: 'checked'
    });

    this.timer = setTimeout(() => {
      this.update();
    }, 500);
  };

  renderDate(date: Date) {
    if (!date) {
      return null;
    }

    return dayjs(date).format('lll');
  }

  render() {
    const { item } = this.props;
    const { product, modifiedAt, count, preCount, uom, status } = item;
    const { diff, remainder } = this.state;

    return (
      <tr>
        <td>{product && `${product.code} - ${product.name}`}</td>

        <td>{this.renderDate(modifiedAt)}</td>
        <td>
          <FinanceAmount>{this.displayNumber(preCount)}</FinanceAmount>
        </td>
        <td>{uom && uom.name}</td>

        <td>
          <FormControl
            checked={status !== 'new'}
            componentClass="checkbox"
            onChange={this.onChangeCheck}
          />
        </td>

        <td>
          <FormControl
            type="number"
            value={remainder}
            onChange={this.onChangeRemainder}
            align={'right'}
          />
        </td>
        <td>
          <FormControl
            type="number"
            value={diff}
            onChange={this.onChangeDiff}
            align={'right'}
          />
        </td>
        <td>
          <ActionButtons>
            <Tip text="Delete" placement="top">
              <Button
                btnStyle="link"
                onClick={this.remove}
                icon="times-circle"
              />
            </Tip>
          </ActionButtons>
        </td>
      </tr>
    );
  }
}

export default Row;
