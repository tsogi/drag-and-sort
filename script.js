// Todo. Prevent text copying of parent element from javascript otherwise window...mouseup listener won't work
(function (){
	let sortableObj = {
		selector: null,
		init: init,
		pressedElement: null,
		clonedElement: null,
		clonedElementContainer: null,
		mousePosition: { x:0, y:0 },
		sortableElements: [],
		containerElement: null,
	};

	function init(){
		this.containerElement = document.querySelector(this.selector);

		this.clonedElementContainer = document.body.appendChild(document.createElement("div"));
		this.clonedElementContainer.setAttribute("style", "position:fixed;");

		this.sortableElements = (Array.from(this.containerElement.childNodes)).filter((element) => { return element.nodeType == element.ELEMENT_NODE });

		addMouseDownEvents.call(this);

		document.addEventListener("mousemove", (event) => {
			this.mousePosition = { x: event.pageX, y: event.pageY };
		})

		setInterval(updateElementLocation.bind(this), 10);

		return this;
	}

	function updateElementLocation(){
		if(this.pressedElement) {
			this.pressedElement.style.visibility = "hidden";
			this.clonedElementContainer.style.top = this.mousePosition.y + "px";
			this.clonedElementContainer.style.left = this.mousePosition.x + "px";
			reorderElements.call(this);
		}
	}

	let sortable = (selector) => {
		sortableObj.selector = selector;
		return sortableObj;
	}

	function addMouseDownEvents(){
		this.sortableElements.forEach((element) => {
			element.addEventListener("mousedown", (event) => {
				this.pressedElement = element;
				this.clonedElement = element.cloneNode(true);
				this.clonedElement.style.cssText = document.defaultView.getComputedStyle(element, "").cssText;
				removeAllChildren(this.clonedElementContainer);
				this.clonedElementContainer.appendChild(this.clonedElement);
			})
		})
		window.addEventListener("mouseup", (event) => {
			this.pressedElement.style.visibility = "visible";
			this.pressedElement = null;
			removeAllChildren(this.clonedElementContainer);
		})
	}

	window.sortableObj = sortableObj;
	window.sortable = sortable;

	function removeAllChildren(element){
	  while(element.firstChild){
	    element.removeChild(element.firstChild);
	  }
	}

	function reorderElements(){
		let newOrder = [];
		let alreadyPushed = false;
		this.sortableElements.forEach((element) => {
			if(element.style.visibility == "hidden") return;

			if(element.getBoundingClientRect().top < this.clonedElement.getBoundingClientRect().top) {
				newOrder.push(element);
			} else {
				if(!alreadyPushed) {
					newOrder.push((this.sortableElements.filter((element) => { return element.style.visibility == "hidden" }))[0]);
					alreadyPushed = true;
				}
				newOrder.push(element);
			}
		});
		if(!alreadyPushed) {
			newOrder.push((this.sortableElements.filter((element) => { return element.style.visibility == "hidden" }))[0]);
		}
		this.sortableElements = newOrder;
		removeAllChildren(this.containerElement);
		this.sortableElements.forEach((element) => {
			this.containerElement.appendChild(element);
		});
	}
})();