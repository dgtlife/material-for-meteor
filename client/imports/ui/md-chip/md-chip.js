/**
 * @file Defines the on-render callback for the MD Chip.
 * @author Derek Gransaull <derek@dgtlife.com>
 * @copyright DGTLife, LLC 2016
 * Created on 7/20/2016
 */
import { eqS } from '../../api/md-utils.js';
import './md-chip.jade';

// On-render callback for MD Chip.
Template.md_chip.onRendered(function onRenderedChip() {
  const label = eqS(this.firstNode, '.md-chip__label');
  const hasIcon = this.data.icon || this.data.image;
  const hasDelete = this.data.deletable || (this.data.deletable === '');
  if (hasIcon) {
    label.classList.add('with-icon');
  }

  if (hasDelete) {
    label.classList.add('with-delete');
  }
});
