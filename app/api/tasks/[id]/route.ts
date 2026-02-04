import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookie } from '@/lib/cookies';
import clientPromise from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db('taskmanager');
    const sessionsCollection = db.collection('sessions');

    const session = await sessionsCollection.findOne({ token });

    if (!session || new Date() > session.expiresAt) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const tasksCollection = db.collection('tasks');
    const task = await tasksCollection.findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const updates = await request.json();

    const client = await clientPromise;
    const db = client.db('taskmanager');
    const sessionsCollection = db.collection('sessions');

    const session = await sessionsCollection.findOne({ token });

    if (!session || new Date() > session.expiresAt) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const tasksCollection = db.collection('tasks');
    const task = await tasksCollection.findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const updatedTask = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedTask }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update task' }, { status: 400 });
    }

    return NextResponse.json({ ...task, ...updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthCookie();

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const client = await clientPromise;
    const db = client.db('taskmanager');
    const sessionsCollection = db.collection('sessions');

    const session = await sessionsCollection.findOne({ token });

    if (!session || new Date() > session.expiresAt) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const tasksCollection = db.collection('tasks');
    const task = await tasksCollection.findOne({
      _id: new ObjectId(id),
      userId: session.userId,
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const result = await tasksCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete task' }, { status: 400 });
    }

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
