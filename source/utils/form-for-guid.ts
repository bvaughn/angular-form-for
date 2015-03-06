/**
 * UID generator for formFor input fields.
 * @see http://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
 */
class FormForGUID {

  /**
   * Create a new GUID.
   */
  public static create():string {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4);
  }
};