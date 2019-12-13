// Todo. Prevent text copying of parent element from javascript otherwise window...mouseup listener won't work
(function (){
	let sortableObj = {
		selector: null,
		init: init,
		pressedElement: null
	};

	function init(){
		let container = document.querySelector(this.selector);

		let sortableElements = (Array.from(container.childNodes)).filter((element) => { return element.nodeType == element.ELEMENT_NODE });

		addMouseDownEvents.call(this, sortableElements);

		setInterval(updateElementLocation.bind(this), 100);

		return this;
	}

	function updateElementLocation(){
		if(this.pressedElement) {
			console.log("this", this);
		}
	}

	let sortable = (selector) => {
		sortableObj.selector = selector;
		return sortableObj;
	}

	function addMouseDownEvents(sortableElements){
		sortableElements.forEach((element) => {
			element.addEventListener("mousedown", (event) => {
				this.pressedElement = element;
				console.log("mousedown on ", this);
			})
		})
		window.addEventListener("mouseup", (event) => {
			this.pressedElement = null;
			console.log("mouseup", this);
		})
	}

	window.sortableObj = sortableObj;
	window.sortable = sortable;
})();