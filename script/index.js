let productsData = [
	{
		id: 0,
		name: 'Футболка UZcotton мужская',
		price: 1051,
		discount: 50.33301617507136,
		amount: 1,
		maxAmount: 2,
		checked: true,
	},
	{
		id: 1,
		name: 'Силиконовый чехол картхолдер (отверстия) для карт, прозрачный кейс бампер на Apple iPhone XR, MobiSafe',
		price: 11500.235,
		discount: 8.695474483782288,
		amount: 200,
		maxAmount: 999,
		checked: true,
	},
	{
		id: 2,
		name: 'Карандаши цветные Faber-Castell "Замок", набор 24 цвета, заточенные, шестигранные, Faber-Castell',
		price: 475,
		discount: 48,
		amount: 2,
		maxAmount: 2,
		checked: true,
	},
]

// General functions

const updateIds = () => {
	let id = 0
	productsData.forEach(product => {
		product.id = id
		id++
	})

	updateNotification()
}

const updateNotification = () => {
	const productsCount = productsData.length

	document
		.querySelectorAll('.user-item__icon_notification')
		.forEach(notification => {
			if (productsCount == 0) notification.remove()

			notification.textContent = productsCount
		})
}

const handleCountChange = (productId, amount) => {
	productsData[productId] = {
		...productsData[productId],
		amount,
	}

	updateTotal()
}

const updateTotalPrice = (price = 0) => {
	const formattedPrice = formatTotal(price)

	document.querySelector('#totalPrice').textContent = formattedPrice
}

const updateDiscountValue = value => {
	if (value !== 0) value = -1 * value

	document.querySelector('#discountValue').textContent = `${value} сом`
}

const updateDiscount = (amount = 0, price = 0) => {
	const discountSpans = document
		.querySelector('#discount')
		.querySelectorAll('span')

	discountSpans[0].textContent = `${amount} товара`
	discountSpans[1].textContent = formatTotal(price) + ' сом'
}

const updateTotal = () => {
	if (productsData.length === 0) {
		updateTotalPrice()
		updateDiscount()
	}

	const totalAmount = productsData.reduce(
		(acc, product) => acc + product.amount,
		0
	)

	const total = productsData.reduce(
		(acc, product) =>
			acc +
			product.amount *
				(product.price - (product.price * product.discount) / 100) *
				product.checked, // amount * price - discount price
		0
	)

	const totalWithoutDiscount = productsData.reduce(
		(acc, product) => acc + product.checked * product.amount * product.price,
		0
	)

	const discountValue = totalWithoutDiscount - total

	updateTotalPrice(total)
	updateDiscount(totalAmount, totalWithoutDiscount)
	updateDiscountValue(discountValue)
}

const formatTotal = (number, fixed = 0) => {
	if (typeof number !== 'string') number = String(number.toFixed(fixed))

	if (number.length < 4) return number

	const reversedNumber = number.split('').reverse().join('')
	const splittedNumber = reversedNumber.match(/\d{1,3}/g)

	let resultNumber = ''

	for (let i = splittedNumber.length - 1; i > 0; i--) {
		resultNumber =
			resultNumber + splittedNumber[i].split('').reverse().join('') + ' '
	}

	if (number.search(/\./) !== -1)
		resultNumber =
			resultNumber.replace(/\s+$/, '') +
			'.' +
			splittedNumber[0].split('').reverse().join('')
	else {
		resultNumber =
			resultNumber.replace(/\s+$/, '') +
			' ' +
			splittedNumber[0].split('').reverse().join('')
	}

	return resultNumber
}

const formatProductName = productName =>
	productName
		.replace(/^\s\s*/, '')
		.replace(/\s\s*$/, '')
		.replace(/\s+/g, ' ')

// Handling products hide
const accordions = document.querySelectorAll('.accordion')

accordions.forEach(accordion =>
	accordion.addEventListener('click', () => {
		const products =
			accordion.parentElement.parentElement.querySelector('.content__products')

		const accordionText = accordion.parentElement.querySelector(
			'.content__select-text'
		)

		if (products.classList.contains('hidden')) {
			products.classList.remove('hidden')

			accordion.parentElement.querySelector(
				'.content__select-text'
			).textContent = 'Выбрать все'

			accordion.parentElement.querySelector('.checkbox').style['display'] =
				'flex'

			accordionText.classList.remove('content__not-available-title')

			return
		}
		products.classList.add('hidden')

		productsCount = productsData.reduce(
			(acc, product) => acc + product.amount,
			0
		)

		accordionText.textContent =
			productsCount +
			' товара · ' +
			document.querySelector('#totalPrice').textContent +
			' сом'

		accordionText.classList.add('content__not-available-title')

		accordion.parentElement.querySelector('.checkbox').style['display'] = 'none'
	})
)

// Handling click on plus or minus buttons
const updateCount = (count, updateType, maxCount = 999) => {
	let countNumber = +count.textContent

	if (updateType == 'increment' && countNumber !== maxCount) {
		countNumber++
	} else if (updateType == 'decrement' && countNumber !== 1) {
		countNumber--
	}

	count.textContent = countNumber

	return count
}

const updateProductPrice = (product, productElement) => {
	const phonePrice = productElement.querySelector('.product__price-text_phone')
	const currentPrice = productElement.querySelector('.product__current-price ')
	const oldPrice = productElement.querySelector('.product__old-price')
	const phoneOldPrice = productElement.querySelector(
		'.product__price-discount_phone'
	)

	const priceWithDiscount = formatTotal(
		product.amount * (product.price - (product.price * product.discount) / 100)
	)

	const priceWithoutDiscount = formatTotal(product.price * product.amount)

	phonePrice.textContent = priceWithDiscount + ' сом'
	currentPrice.textContent = priceWithDiscount
	oldPrice.textContent = priceWithoutDiscount + ' сом'
	phoneOldPrice.textContent = priceWithoutDiscount + ' сом'
}

const createProduct = ({ name, price }) => {
	// create paste products templates
}

// Handling checkboxes
const checkboxes = document.querySelectorAll('.cart .checkbox')

checkboxes[0].addEventListener('change', () => {
	for (let i = 1; i < checkboxes.length; i++) {
		checkboxes[i].checked = checkboxes[0].checked
	}

	productsData.forEach(product => (product.checked = checkboxes[0].checked))

	updateTotal()
})

for (let i = 1; i < checkboxes.length; i++) {
	checkboxes[i].addEventListener('change', () => {
		const productName = formatProductName(
			checkboxes[i].closest('.content__product').querySelector('.product__name')
				.textContent
		)

		const productId = productsData.findIndex(
			product => product.name === productName
		)

		productsData[productId].checked = checkboxes[i].checked

		updateTotal()
	})
}

const instantApplyCheckbox = document.querySelector('#instant-apply')

instantApplyCheckbox.addEventListener('change', () => {
	const price = document.querySelector('#totalPrice').textContent

	const confirmButton = document.querySelector('.order__confirm')

	if (instantApplyCheckbox.checked) {
		confirmButton.textContent = 'Оптатить ' + price + ' сом'
		return
	}

	confirmButton.textContent = 'Заказать'
})

// Handling counters
const cartCounters = document.querySelectorAll('.cart .product__amount-actions') // maybe I should get products here instead to not looking for them in the loop

cartCounters.forEach(counter => {
	const productName = formatProductName(
		counter.closest('.content__product').querySelector('.product__name')
			.textContent
	)

	const buttons = counter.querySelectorAll('button')

	let count = counter.querySelector('.product__amount')
	const incrementButton = buttons[1]
	const decrementButton = buttons[0]

	incrementButton.addEventListener('click', () => {
		const product = productsData.filter(
			product => product.name === productName
		)[0]

		const buttonType = 'increment'
		const updatedCount = updateCount(count, buttonType, product.maxAmount)

		decrementButton.classList.add('product__button_active')

		if (+updatedCount.textContent === product.maxAmount) {
			incrementButton.classList.remove('product__button_active')
		} else {
			incrementButton.classList.add('product__button_active')
		}
		// Maybe I should check if count changing before for not doing extra iterations
		handleCountChange(product.id, +updatedCount.textContent)

		updateProductPrice(
			productsData[product.id],
			incrementButton.closest('.content__product')
		)
	})

	decrementButton.addEventListener('click', () => {
		const product = productsData.filter(
			product => product.name === productName
		)[0] // make a function

		const buttonType = 'decrement'
		const updatedCount = updateCount(count, buttonType, product.amount)

		incrementButton.classList.add('product__button_active')

		if (+updatedCount.textContent === 1) {
			decrementButton.classList.remove('product__button_active')
		} else {
			decrementButton.classList.add('product__button_active')
		}
		// Maybe I should check if count changing before for not doing extra iterations
		handleCountChange(product.id, +updatedCount.textContent)

		updateProductPrice(
			productsData[product.id],
			decrementButton.closest('.content__product')
		)
	})
})

// Handling like and delete buttons
const productActionBlocks = document.querySelectorAll('.product__actions-list')

productActionBlocks.forEach(productActionsList => {
	const productActions = productActionsList.querySelectorAll(
		'.product__actions-item'
	)

	const likeButton = productActions[0]
	const deleteButton = productActions[1]

	likeButton.addEventListener('click', () => {
		if (likeButton.classList.contains('like_active')) {
			likeButton.classList.remove('like_active') // maybe I should optimize css

			return
		}

		likeButton.classList.add('like_active')
	})

	deleteButton.addEventListener('click', () => {
		const productBlock = deleteButton.closest('.content__product')

		const productName = formatProductName(
			productBlock.querySelector('.product__name').textContent
		)

		const deletingProductId = productsData.findIndex(
			product => product.name === productName
		)

		productsData.splice(deletingProductId, 1)

		updateTotal()
		updateIds()
		productBlock.remove()
	})
})

// Validation
const inputs = document.querySelectorAll('.cart-form__input')

inputs.forEach(input =>
	input.addEventListener('focusout', () => {
		const isValid = validate(input.value, input.id)
		const errorSpan = input.closest('label').querySelector('.cart-form__error')

		if (!isValid) {
			errorSpan.classList.remove('hidden')
			errorSpan.classList.add('cart-form__error_active')
			input.classList.add('cart-form__input_error')

			if (input.id === 'inn') errorSpan.textContent = 'Проверьте ИНН'

			return
		}

		if (input.id === 'inn') errorSpan.textContent = 'Для таможенного оформления'
		errorSpan.classList.add('hidden')
		errorSpan.classList.remove('cart-form__error_active')
		input.classList.remove('cart-form__input_error')
	})
)

const validate = (text, inputType) => {
	switch (inputType) {
		case 'name':
			if (text === '') return false
			break
		case 'email':
			if (
				text
					.toLowerCase()
					.match(
						/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
					) === null
			)
				return false
			break
		case 'mobile':
			if (text.match(/^[\s()+-]*([0-9][\s()+-]*){6,20}$/) === null) return false
			break
		case 'inn':
			if (text.length !== 14) return false
			break
	}

	return true
}

// Modals

let shipment = {
	shipment: [
		{
			name: 'г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1',
			rating: '4.99',
		},
		{
			name: 'г. Бишкек, микрорайон Джал, улица Ахунбаева Исы, д. 67/1',
			rating: '4.99',
		},
		{
			name: 'г. Бишкек, улица Табышалиева, д. 57',
			rating: '4.99',
		},
	],
	courier: [
		{
			name: 'Бишкек, улица Табышалиева, 57',
		},
		{
			name: 'Бишкек, улица Жукеева-Пудовкина, 77/1',
		},
		{
			name: 'Бишкек, микрорайон Джал, улица Ахунбаева Исы, 67/1',
		},
	],
}

const deliveryAltOpenModalButton = document.querySelector('.order__detail-img')
const deliveryOpenModalButton = document.querySelector('.delivery__button')
const deliveryCloseButton = document.querySelector('.dialog__close')
const deliveryModal = document.querySelector('#delivery-modal')

deliveryAltOpenModalButton.addEventListener('click', () =>
	deliveryModal.showModal()
)
deliveryOpenModalButton.addEventListener('click', () =>
	deliveryModal.showModal()
)
deliveryCloseButton.addEventListener('click', () => {
	deliveryModal.close()
})

const deliveryModalButtons = document.querySelectorAll(
	'.delivery__selector-button'
)

deliveryModalButtons[0].addEventListener('click', () => {
	if (
		deliveryModalButtons[0].classList.contains(
			'delivery__selector-button_active'
		)
	)
		return

	deliveryModalButtons[0].classList.add('delivery__selector-button_active')
	deliveryModalButtons[1].classList.remove('delivery__selector-button_active')

	document.querySelector('.shipment-form').style['display'] = 'flex'
	document.querySelector('.courier-form').style['display'] = 'none'
})

deliveryModalButtons[1].addEventListener('click', () => {
	if (
		deliveryModalButtons[1].classList.contains(
			'delivery__selector-button_active'
		)
	)
		return

	deliveryModalButtons[1].classList.add('delivery__selector-button_active')
	deliveryModalButtons[0].classList.remove('delivery__selector-button_active')

	document.querySelector('.shipment-form').style['display'] = 'none'
	document.querySelector('.courier-form').style['display'] = 'flex'
})

document
	.querySelector('#delivery-modal-button')
	.addEventListener('click', () => {})

const paymentModal = document.querySelector('#payment-methods')
const paymentMethodButton = document.querySelector('#payment-method-button')
const alternateMethodButton = document.querySelector(
	'#alternate-payment-button'
)
const paymentCloseButton = document.querySelector('.payment-methods-close')

paymentMethodButton.addEventListener('click', () => {
	paymentModal.showModal()
})
alternateMethodButton.addEventListener('click', () => {
	paymentModal.showModal()
})
paymentCloseButton.addEventListener('click', () => {
	paymentModal.close()
})
alternateMethodButton.addEventListener('click', () => {
	paymentModal.close()
})
