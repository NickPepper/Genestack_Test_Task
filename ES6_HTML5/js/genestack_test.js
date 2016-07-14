/**
 * @file: The test task for the UI Developer position at Genestack (https://genestack.com/)
 * @author: Nick Pershin
 * @copyright: Nick Pershin © 2016
 */

;"use strict";

const DEBUG = false; // switch the debug info on/off
const DEFAULT_ITEMS_PER_PAGE = 4;


class PaginationHelper {

    //
    // ATTENTION: 
    //
    // 1) we allow to pass the parameter of type {String} when the method requires it to be {Number}.
    // In such cases we try to convert {String} to {Integer} using the {+} undocumented feature
    // Just consider that as a delicious candy ;)
    // It is at every moment easy to avoid such behaviour if we wanna.
    //
    // 2) if the 'collection' is an empty Array, the {pageCount} returns 0
    //

    constructor(collection = [], itemsPerPage = DEFAULT_ITEMS_PER_PAGE) {
        if(!Array.isArray(collection)) {
            throw new TypeError('collection must be an Array!');
        }
        let ipp = +itemsPerPage;
        this.checkIntParam('itemsPerPage passed to PaginationHelper()', ipp);
        if(ipp < 1) {
            throw new TypeError('itemsPerPage must be a positive Integer!');
        }
        this.collection = collection;
        this.items_per_page = +itemsPerPage;
        this.items_count = this.collection.length;
        this.pages_count = this.items_count ? Math.ceil(this.items_count / this.items_per_page) : 0;
        DEBUG && window.console && console.log('an instance of PaginationHelper created OK');
    }


    /**
     * Detects if the parameter is a natural number.
     * @return {Boolean}
     */
    isNaturalNumber(n) {
        return typeof n === 'number' && n%1 === 0;
    }


    /**
     * Warns if the parameter is a 'safe' Integer.
     */
    isSafeInteger(n) {
        return Math.abs(n) <= 9007199254740991; // ( 9007199254740991 == Math.pow(2, 53) - 1 )
    }


    /**
     * Checks the 'value' parameter for following:
     * - finite number ?
     * - natural number ?
     * - safe Integer ?
     *
     * @param name {String}
     * @param value {Number?}
     */
    checkIntParam(name, value) {
        if(!isFinite(value) || !this.isNaturalNumber(value)) {
            throw new TypeError(`${name} must be finite Integer!`);
        }
        if(!this.isSafeInteger(value)) {
            throw new Error(`${name} is not the safe Integer!`);
        }
    }


    /**
     * Number of items within the entire collection.
     * @return {Number}
     */
    itemCount() {
        return this.items_count;
    }


    /**
     * Number of pages.
     * @return {Number}
     */
    pageCount() {
        return this.pages_count;
    }


    /**
     * Number of items on the current page.
     * @param {Number - Integer}   pageIndex        Zero based
     * @return {Number} or -1 for pageIndex values that are out of range
     */
    pageItemCount(pageIndex) {
        let result = 0,
            page_index = +pageIndex,
            last_page = page_index == this.pages_count - 1;
        this.checkIntParam('pageIndex passed to pageItemCount()', page_index);
        if(page_index >= this.pages_count || page_index < 0) {
            result = -1;
        } else if(this.pages_count == 1) {
            result = this.items_count;
        } else {
            result = last_page ? Math.floor(this.items_count / this.pages_count-1) : this.items_per_page;
        }
        return result;
    }


    /**
     * Determines what page an item is on.
     * @param {Number}   itemIndex        Zero based
     * @return {Number} or -1 for itemIndex values that are out of range
     */
    pageIndex(itemIndex) {
        let result = 0,
            item_index = +itemIndex;
        this.checkIntParam('itemIndex passed to pageIndex', item_index);
        if(item_index >= this.items_count || item_index < 0) {
            result = -1;
        } else if(item_index >= this.items_per_page) { // not the first page
            result = Math.floor(item_index / this.items_per_page);
        }
        return result;
    }

}













// of course the tests could be improved, including randoms generation etc. 
// but I hope it is OK as it is for the test task ;)
function runTests() {
    if(!window.console) return; // TODO: special test environment for mobiles etc

    let val, passed;

    console.log('"usual" test cases (56 total):\n\n');

    let ph_1 = new PaginationHelper(['a','b','c','d','e','f'], 4),
        ph_2 = new PaginationHelper(['1','2','3'], '4'),
        ph_3 = new PaginationHelper([0, 'a','b','c'], 4),
        ph_4 = new PaginationHelper(['a',[],{},[1,2,3,null,null], null, 'e', undefined, 'f', 100500, 'ХОБАНА!', 12, {bug:'sure'}, function(){return 'BIG BUG?';}], 3);

    val = ph_1.pageCount();
    passed = val == 2 ? 'PASSED' : 'FAIL'; // should == 2
    console.log(`ph_1.pageCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_1.itemCount();
    passed = val == 6 ? 'PASSED' : 'FAIL'; // should == 6
    console.log(`ph_1.itemCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_1.pageItemCount(0);
    passed = val == 4 ? 'PASSED' : 'FAIL'; // should == 4
    console.log(`ph_1.pageItemCount(0) == ${val}\t\t\t${passed}`);
    val = ph_1.pageItemCount(1);
    passed = val == 2 ? 'PASSED' : 'FAIL'; // last page -> should == 2
    console.log(`ph_1.pageItemCount(1) == ${val}\t\t\t${passed}`);
    val = ph_1.pageItemCount(2);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1 since the page is invalid
    console.log(`ph_1.pageItemCount(2) == ${val}\t\t\t${passed}`);
    val = ph_1.pageItemCount(-2);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1 since the page is invalid
    console.log(`ph_1.pageItemCount(-2) == ${val}\t\t${passed}`);
    val = ph_1.pageIndex(5);
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1 (zero based index)
    console.log(`ph_1.pageIndex(5) == ${val}\t\t\t\t${passed}`);
    val = ph_1.pageIndex(4);
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1 (zero based index)
    console.log(`ph_1.pageIndex(4) == ${val}\t\t\t\t${passed}`);
    val = ph_1.pageIndex(0);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_1.pageIndex(0) == ${val}\t\t\t\t${passed}`);
    val = ph_1.pageIndex(-0);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_1.pageIndex(-0) == ${val}\t\t\t\t${passed}`);
    val = ph_1.pageIndex("-0");
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_1.pageIndex("-0") == ${val}\t\t\t${passed}`);
    val = ph_1.pageIndex(3);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_1.pageIndex(3) == ${val}\t\t\t\t${passed}`);
    val = ph_1.pageIndex(2);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_1.pageIndex(2) == ${val}\t\t\t\t${passed}`);
    val = ph_1.pageIndex(20);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_1.pageIndex(20) == ${val}\t\t\t${passed}`);
    val = ph_1.pageIndex(-10);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_1.pageIndex(-10) == ${val}\t\t\t${passed}`);


    console.log('');
    val = ph_2.pageCount();
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1
    console.log(`ph_2.pageCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_2.itemCount();
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_2.itemCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_2.pageItemCount(0);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_2.pageItemCount(0) == ${val}\t\t\t${passed}`);
    val = ph_2.pageItemCount(1);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_2.pageItemCount(1) == ${val}\t\t\t${passed}`);
    val = ph_2.pageItemCount(123);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_2.pageItemCount(123) == ${val}\t\t${passed}`);
    val = ph_2.pageItemCount(-100);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_2.pageItemCount(-100) == ${val}\t\t${passed}`);
    val = ph_2.pageIndex('-0');
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_2.pageIndex("-0") == ${val}\t\t\t${passed}`);
    val = ph_2.pageIndex(-0);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_2.pageIndex(-0) == ${val}\t\t\t\t${passed}`);
    val = ph_2.pageIndex('5');
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_2.pageIndex("5") == ${val}\t\t\t${passed}`);
    val = ph_2.pageIndex(1);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_2.pageIndex(1) == ${val}\t\t\t\t${passed}`);


    console.log('');
    val = ph_3.pageCount();
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1
    console.log(`ph_3.pageCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_3.itemCount();
    passed = val == 4 ? 'PASSED' : 'FAIL'; // should == 4
    console.log(`ph_3.itemCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_3.pageItemCount(0);
    passed = val == 4 ? 'PASSED' : 'FAIL'; // should == 4
    console.log(`ph_3.pageItemCount(0) == ${val}\t\t\t${passed}`);
    val = ph_3.pageItemCount(-0);
    passed = val == 4 ? 'PASSED' : 'FAIL'; // should == 4
    console.log(`ph_3.pageItemCount(-0) == ${val}\t\t\t${passed}`);
    val = ph_3.pageItemCount(-1);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_3.pageItemCount(-1) == ${val}\t\t${passed}`);
    val = ph_3.pageItemCount(5);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_3.pageItemCount(5) == ${val}\t\t\t${passed}`);
    val = ph_3.pageIndex(-5);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_3.pageIndex(-5) == ${val}\t\t\t${passed}`);
    val = ph_3.pageIndex(0);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_3.pageIndex(0) == ${val}\t\t\t\t${passed}`);
    val = ph_3.pageIndex("3");
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_3.pageIndex("3") == ${val}\t\t\t${passed}`);


    console.log('');
    val = ph_4.pageCount();
    passed = val == 5 ? 'PASSED' : 'FAIL'; // should == 5
    console.log(`ph_4.pageCount == ${val}\t\t\t\t\t${passed}`);
    val = ph_4.itemCount();
    passed = val == 13 ? 'PASSED' : 'FAIL'; // should == 13
    console.log(`ph_4.itemCount == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageItemCount(0);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageItemCount(0) == ${val}\t\t\t${passed}`);
    val = ph_4.pageItemCount(1);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageItemCount(1) == ${val}\t\t\t${passed}`);
    val = ph_4.pageItemCount(2);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageItemCount(2) == ${val}\t\t\t${passed}`);
    val = ph_4.pageItemCount(3);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageItemCount(3) == ${val}\t\t\t${passed}`);
    val = ph_4.pageItemCount(4);
    passed = val == 1 ? 'PASSED' : 'FAIL'; // last page -> should == 1
    console.log(`ph_4.pageItemCount(4) == ${val}\t\t\t${passed}`);
    val = ph_4.pageIndex(0);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_4.pageIndex(0) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(1);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_4.pageIndex(1) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(2);
    passed = val == 0 ? 'PASSED' : 'FAIL'; // should == 0
    console.log(`ph_4.pageIndex(2) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(3);
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1
    console.log(`ph_4.pageIndex(3) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex("4");
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1
    console.log(`ph_4.pageIndex("4") == ${val}\t\t\t${passed}`);
    val = ph_4.pageIndex(5);
    passed = val == 1 ? 'PASSED' : 'FAIL'; // should == 1
    console.log(`ph_4.pageIndex(5) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(6);
    passed = val == 2 ? 'PASSED' : 'FAIL'; // should == 2
    console.log(`ph_4.pageIndex(6) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(7);
    passed = val == 2 ? 'PASSED' : 'FAIL'; // should == 2
    console.log(`ph_4.pageIndex(7) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(8);
    passed = val == 2 ? 'PASSED' : 'FAIL'; // should == 2
    console.log(`ph_4.pageIndex(8) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(9);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageIndex(9) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(10);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageIndex(10) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(11);
    passed = val == 3 ? 'PASSED' : 'FAIL'; // should == 3
    console.log(`ph_4.pageIndex(11) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex(12);
    passed = val == 4 ? 'PASSED' : 'FAIL'; // last page -> should == 4
    console.log(`ph_4.pageIndex(12) == ${val}\t\t\t\t${passed}`);
    val = ph_4.pageIndex("-2");
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_4.pageIndex("-2") == ${val}\t\t\t${passed}`);
    val = ph_4.pageIndex(22);
    passed = val == -1 ? 'PASSED' : 'FAIL'; // should == -1
    console.log(`ph_4.pageIndex(22) == ${val}\t\t\t${passed}`);


    // cleanup
    ph_1 = null;
    ph_2 = null;
    ph_3 = null;
    ph_4 = null;
    val = null;
    passed = null;


    console.log('\n\ncritical (stress) test cases: see the commented code within the runTests()\n\n');

    //
    // ALL THE CASES BELOW MUST THROW AN INTERNAL EXCEPTION from the PaginationHelper:
    //
    // let ph = new PaginationHelper([1,2,3], Number.NEGATIVE_INFINITY);
    // let ph = new PaginationHelper([1,2,3], 'haha');
    // let ph = new PaginationHelper([Number.POSITIVE_INFINITY, "hahha", 9007199254740992], '4');
    // let ph = new PaginationHelper([0,null,undefined], 1.2);
    // let ph = new PaginationHelper(new Int32Array([1, 2, 3, 4]), 4);
    // etc etc etc...
    //

}

document.getElementById("btn_test").addEventListener('click', function(e) {
    runTests();
},false);
