import { ResultSetHeader } from 'mysql2';
import connection from '../../shared/config/database';
import { Order } from '../models/Order';
import { OrderCoffee } from '../models/OrderCoffee';

export class OrderRepository {
    public static async createOrder(order: Order): Promise<Order> {
        const query = 'INSERT INTO `order` (date_orders, client_id_fk, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, ?, ?, ?, ?)';
        return new Promise((resolve, reject) => {
            connection.execute(query, [order.date_orders, order.client_id_fk, order.created_at, order.created_by, order.updated_at, order.updated_by, order.deleted], (error, result: ResultSetHeader) => {
                if (error) {
                    reject(error);
                } else {
                    const createdOrderId = result.insertId;
                    const createdOrder: Order = { ...order, order_id: createdOrderId };
                    resolve(createdOrder);
                }
            });
        });
    }

    public static async addOrderCoffee(order_id_fk: number, orderCoffee: OrderCoffee): Promise<void> {
        const query = 'INSERT INTO order_coffee (order_id_fk, coffee_id_fk, quantify, created_at, created_by, updated_at, updated_by, deleted) VALUES (?, ?, ?, NOW(), ?, NOW(), ?, 0)';
        return new Promise((resolve, reject) => {
            connection.execute(query, [order_id_fk, orderCoffee.coffee_id_fk, orderCoffee.quantify, orderCoffee.created_by, orderCoffee.updated_by], (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    public static async findAll(): Promise<Order[]> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `order`', (error: any, results) => {
                if (error) {
                    reject(error);
                } else {
                    const orders: Order[] = results as Order[];
                    resolve(orders);
                }
            });
        });
    }

    public static async findById(order_id: number): Promise<Order | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `order` WHERE order_id = ?', [order_id], (error: any, results) => {
                if (error) {
                    reject(error);
                } else {
                    const orders: Order[] = results as Order[];
                    if (orders.length > 0) {
                        resolve(orders[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async findByDate(date_orders: string): Promise<Order | null> {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM `order` WHERE date_orders = ?', [date_orders], (error: any, results) => {
                if (error) {
                    reject(error);
                } else {
                    const orders: Order[] = results as Order[];
                    if (orders.length > 0) {
                        resolve(orders[0]);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async updateOrder(order_id: number, orderData: Order): Promise<Order | null> {
        const query = 'UPDATE `order` SET date_orders = ?, client_id_fk = ?, updated_at = ?, updated_by = ?, deleted = ? WHERE order_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [orderData.date_orders, orderData.client_id_fk, orderData.updated_at, orderData.updated_by, orderData.deleted, order_id], (error, result: ResultSetHeader) => {
                if (error) {
                    reject(error);
                } else {
                    if (result.affectedRows > 0) {
                        const updatedOrder: Order = { ...orderData, order_id };
                        resolve(updatedOrder);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    public static async deleteOrder(order_id: number): Promise<boolean> {
        const query = 'DELETE FROM `order` WHERE order_id = ?';
        return new Promise((resolve, reject) => {
            connection.execute(query, [order_id], (error, result: ResultSetHeader) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result.affectedRows > 0);
                }
            });
        });
    }
}