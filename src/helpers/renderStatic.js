import { defaultSwissController } from '../classes/SwissController';

export default (asComponents) => {
  if(asComponents) {
    return defaultSwissController.toComponents();
  }
  return defaultSwissController.toString();
}