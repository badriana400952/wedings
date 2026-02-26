import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function changePassword() {
  try {
    console.log('\n===========================================');
    console.log('🔐 CHANGE ADMIN PASSWORD');
    console.log('===========================================\n');

    const email = await question('Enter admin email (default: admin@undangan.com): ');
    const adminEmail = email.trim() || 'admin@undangan.com';

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!user) {
      console.log(`\n❌ User with email "${adminEmail}" not found!`);
      console.log('Please run: npm run create-admin\n');
      rl.close();
      return;
    }

    console.log(`\n✅ User found: ${user.name} (${user.email})`);

    const newPassword = await question('\nEnter new password: ');
    
    if (!newPassword || newPassword.length < 6) {
      console.log('\n❌ Password must be at least 6 characters!');
      rl.close();
      return;
    }

    const confirmPassword = await question('Confirm new password: ');

    if (newPassword !== confirmPassword) {
      console.log('\n❌ Passwords do not match!');
      rl.close();
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    });

    console.log('\n===========================================');
    console.log('✅ PASSWORD CHANGED SUCCESSFULLY!');
    console.log('===========================================');
    console.log(`\nEmail: ${adminEmail}`);
    console.log(`New Password: ${newPassword}`);
    console.log('\n⚠️  Please save this password in a secure place!');
    console.log('===========================================\n');

  } catch (error) {
    console.error('\n❌ Error changing password:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

changePassword();
