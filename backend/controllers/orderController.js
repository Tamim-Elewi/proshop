import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'

// @desc Create new order0
// @toute Post /api/v1/orders
// @access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, itemsPrice, totalPrice } = req.body

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order items')
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      itemsPrice,
      totalPrice,
    })

    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @desc Get order by ID
// @toute GET /api/v1/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )

  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found!!')
  }
})

// @desc Get logged in user order
// @toute GET /api/v1/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.json(orders)
})

export { addOrderItems, getOrderById, getMyOrders }
