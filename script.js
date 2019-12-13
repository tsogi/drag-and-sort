// Todo. Prevent text copying of parent element from javascript otherwise window...mouseup listener won't work
(function (){
	let sortableObj = {
		selector: null,
		init: init,
		pressedElement: null,
		clonedElement: null,
		clonedElementContainer: null,
		mousePosition: { x:0, y:0 }
	};

	function init(){
		let container = document.querySelector(this.selector);

		this.clonedElementContainer = document.body.appendChild(document.createElement("div"));
		this.clonedElementContainer.setAttribute("style", "position:fixed;");

		let sortableElements = (Array.from(container.childNodes)).filter((element) => { return element.nodeType == element.ELEMENT_NODE });

		addMouseDownEvents.call(this, sortableElements);

		document.addEventListener("mousemove", (event) => {
			this.mousePosition = { x: event.pageX, y: event.pageY };
		})

		setInterval(updateElementLocation.bind(this), 10);

		return this;
	}

	function updateElementLocation(){
		if(this.pressedElement) {
			console.log(this.mousePosition.x, this.mousePosition.y);
			this.clonedElementContainer.style.top = this.mousePosition.y + "px";
			this.clonedElementContainer.style.left = this.mousePosition.x + "px";
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
				this.clonedElement = element.cloneNode(true);
				this.clonedElement.style.cssText = document.defaultView.getComputedStyle(element, "").cssText;
				removeAllChildren(this.clonedElementContainer);
				this.clonedElementContainer.appendChild(this.clonedElement);
			})
		})
		window.addEventListener("mouseup", (event) => {
			this.pressedElement = null;
		})
	}

	window.sortableObj = sortableObj;
	window.sortable = sortable;

	function removeAllChildren(element){
	  while(element.firstChild){
	    element.removeChild(element.firstChild);
	  }
	}
})();